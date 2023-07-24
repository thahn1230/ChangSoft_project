from fastapi import APIRouter
from fastapi.responses import JSONResponse
from fastapi import FastAPI
from pydantic import BaseModel
import json
import plotly
import plotly.graph_objects as go
import openai
from typing import Any
import pymysql
from typing import Tuple

import pandas as pd
from pymysql.cursors import DictCursor
from sqlalchemy import create_engine, text
from sqlalchemy_utils import database_exists, create_database
import os
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt
import matplotlib.font_manager as fm
from sqlalchemy import create_engine, MetaData, Table
from sqlalchemy.orm import sessionmaker, scoped_session
from enum import Enum

from sqlalchemy import text
from dbAccess import create_db_connection

from aiQueryInfo import imports, code_condition, db_explanation, db_schema, db_query_example, APIkey, plotly_data_example

class Role(Enum):
    System = "system"
    User = "user"
    Assistant = "assistant"
class Message():
    def __init__(self, role: Role, content: str):
        self.role = role
        self.content = content
    def __str__(self):
        return f'{{"role": "{self.role.value}", "content": "{self.content}"}}'
    def to_dict(self):
        return {"role": self.role.value, "content": self.content}
    


router = APIRouter()
engine = create_db_connection()
connection = engine.connect()

font_location = "Others/malgun" # For Windows
font_name = fm.FontProperties(fname=font_location).get_name()
plt.rc('font', family=font_name)

pymysql.install_as_MySQLdb()

openai.api_key = APIkey

stackedMessage = []

class Query(BaseModel):
    query: str

@router.post("/query")
async def execute_query(query: Query): 
    pron_dict = prepare_pronoun_dictionary(query.query)
    code, error = process_prompt(query.query, pron_dict)
    #response = send_prompt(prompt)
    
    answer = ""
    retry_count = 0
    
    while True:

        answer, error = execute_python(code)

        if answer != "":
            break
        
        if retry_count > 5 :
            answer = "답을 얻지 못했습니다."
            error = "Error: retry회수가 초과되었습니다."
            break
        
        code = correct_code(code, pron_dict, error)
        retry_count += 1
    
    print("answer: ", answer)
    if("{" in answer):
        return answer
    return prepare_answer(query.query, answer, error)

    # 4. Return debug info and graph
    #return {"debugInfo": response, "exception":exception, "graph": fig_url, "graphExp": explanation}

def prepare_answer(query, answer, error):
    prompt =f""" You will be provided with an query from user and answer to it or error message if we have no answer, which are delimited by triple quotes.
    make an formal answer to the customer's query based on those information in Korean. Don't repeat the question in the answer.

        Query: ```{query}```
        Answer: ```{answer}```
        error: ```{error}```
    """  
    system_prompt = f""" 
    """

    message = system_prompt + "\n\n" + prompt # gpt-3.5 한정
    final_answer = ask_gpt(system_prompt + "\n\n" + prompt)
    
    return final_answer

def correct_code(code, pron_dict, error):

    prompt =f""" You will be provided with an error message and the code which produced it, which are delimited by triple quotes.
    Correct the code based on the error message. When answering, never add additional phrases like 'Here it is' or 'I have modified ~', etc. Only the code. Don't wrap it with any quotes either.

        Error: ```{error}```
        Code: ```{code}```
    """  
    system_prompt = f""" Imports : {imports},
    code_condition : {code_condition},
    db_schema : {db_schema},
    db_explanation: {db_explanation},
    db_query_example : {db_query_example}
    dictionary : {pron_dict},
    plotyly_data_example: {plotly_data_example}
    """

    correct_code = ask_gpt(system_prompt + "\n\n" + prompt)
    
    prompt =f"""You will be provided with a text string delimited by triple quotes.
    Extract only the Python code part from the string, and if there is a syntax error, correct it. When you answer, Never add additional words like 'Here it is' or 'I have modified ~', etc. Only the code. Don't wrap it with any quotes either.

        ```{correct_code}```
    """  
    system_prompt = ""
    correct_code = ask_gpt(system_prompt + "\n\n" + prompt)

    return correct_code

def send_prompt(prompt: str) -> str:

    response = openai.ChatCompletion.create(
    model="gpt-3.5-turbo-16k-0613",
    messages=[
        {"role": "system", "content": "You are a helpful python data scientist."},
        {"role": "user", "content": prompt},
        {"role": "assistant", "content": stackedMessage},
    ]
    )

    print(response.choices[0].message)

    return response

def ask_gpt(messages):
    response = openai.ChatCompletion.create(
    model="gpt-3.5-turbo-16k-0613",
    #model="gpt-4-0613",
    messages=[message.to_dict() for message in messages],
    temperature=0.2
    )
    answer = response['choices'][0]['message']['content']
    print(answer)
    return answer

def process_prompt(question: str, pron_dict : str) -> str:
    """Prepare the prompt for the OpenAI API based on the user's question."""

    prompt = f"""Assess whether the question enclosed in the following ``` is related to the builderhub db without considering its executability, and respond in the following Json format :
        질문: ```{question}```,        
        만약 모르겠으면 그냥 'no'라고 답해.
        
        답변형식 :
        "{{
            "answer":"yes" or "no",     
            "reason": "why..."
        }}"

        답하기 전에, 너의 답이 문제가 없는 json형식인지 점검하고 답해줘.
        """
    system_prompt = f"""
        db_schema : {db_schema},
        db_explanation: {db_explanation},
        dictionary : {pron_dict},
    """

    answer = ask_gpt(system_prompt + "\n\n" + prompt)
    answer = json.loads(answer)
    if str.lower(answer['answer']).strip() == 'no':
        return "", answer['reason']
    
    

    prompt =f"""Write Python code that can answer the following question :
        {code_condition},
        python_imports : {imports},     

        Question: ```{question}```,  
        
        Before answering, make sure your response is comprised only of Python code that can be executed without any issues. Once you've composed your answer using purely code, provide it in the following JSON format.
        "{{
            "code":"your code here"
        }}"
        """
    system_prompt = f"""
        db_schema : {db_schema},
        db_explanation: {db_explanation},
        db_query_example : {db_query_example},        
        dictionary : {pron_dict},
        """
    answer = ask_gpt(system_prompt + "\n\n" + prompt)

    prompt =f"""다음 스트링에서 python code 부분만 추출한다음, 문법적인 오류가 있다면 수정해서 줘. '여기 있습니다' 또는 '~를 수정했습니다' 같은 추가적인 말은 절대 붙이지마. 오직 코드만. '''등으로 감싸지도 마.

        ```{answer}```
    """  
    system_prompt = ""
    code = ask_gpt(system_prompt + "\n\n" + prompt)
        
    
    return code, ""

def prepare_pronoun_dictionary(question: str):
    """question을 분석하여 고유명사를 db field와 연결짓는 dictionary를 만든다."""
    pro_dict = {}

    #TODO 여기서 먼저 unique company_name list, unique_ project_name list , building_name, component_type, 등등 고유 명사가 될 만한 것들을 Query해서 준비해 놓는다.
    pro_dict_db_str = get_db_pronouns()
    
    prompt =f"""다음 Question string을 분석해서 고유명사를 분리한 후, 가장 가까운 DB schema의 field name과 연결 짓는 Json 출력을 생성해줘 :
        Question string: ```{question}```,  
        
        DB Schema: {db_explanation}     
        DB Explanation: {db_explanation}
        DB Unique Names and types : {pro_dict_db_str}        
        """
    
    system_prompt = f"""
    """
    answer = ask_gpt(system_prompt + "\n\n" + prompt)
    pro_dict = json.loads(answer)

    return pro_dict

def get_db_pronouns():
    
    pro_dict_db ={}

    metadata = MetaData()
    Session = scoped_session(sessionmaker(bind=engine))
    session = Session()

    project = Table('project', metadata, autoload_with=engine)

    query = session.query(project.c.project_name.distinct())
    unique_projects = [row[0] for row in query.all()]

    query = session.query(project.c.construction_company.distinct())
    unique_companies = [row[0] for row in query.all()]

    query = session.query(project.c.zone.distinct())
    unique_zones = [row[0].split(',') for row in query.all()]
    unique_zones = [item for sublist in unique_zones for item in sublist]

    query = session.query(project.c.location.distinct())
    unique_locations = [row[0] for row in query.all()]

    building = Table('building', metadata, autoload_with=engine)
    query = session.query(building.c.building_name.distinct())
    unique_buildings = [row[0] for row in query.all()]

    component = Table('component', metadata, autoload_with=engine)
    query = session.query(component.c.component_type.distinct())
    unique_component_types = [row[0] for row in query.all()]

    
    for name in unique_companies:
        pro_dict_db[name] = 'project.construction_company'

    for name in unique_projects:
        pro_dict_db[name] = 'project.project_name'

    for name in unique_zones:
        pro_dict_db[name] = 'project.zone'

    for name in unique_locations:
        pro_dict_db[name] = 'project.location'

    for name in unique_buildings:
        pro_dict_db[name] = 'building.building_name'

    for name in unique_component_types:
        pro_dict_db[name] = 'component.component_type'    

    pro_dict_db_str = json.dumps(pro_dict_db, ensure_ascii=False)

    return pro_dict_db_str

def execute_python(string_python: str) -> Any:
    """Execute the Python code from the OpenAI API response and return the result."""
    # data = json.loads(response)
    # string_python = data['choices'][0]['message']['content']
    local_vars = {}
    try:
        # Execute the Python code and capture the result
        exec(string_python,globals(), local_vars)
    except Exception as e:
        # If an error occurred during execution, raise it
        return "", str(e)
    if 'answer' not in local_vars:
        return "", "Error: local_variable 'answer'가 정의되지 않았습니다"
    else:
        answer = local_vars.get('answer')
        return answer, ""