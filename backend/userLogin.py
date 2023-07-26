from fastapi import APIRouter
from fastapi.responses import JSONResponse

from dbAccess import create_db_connection
from sqlalchemy.orm import Session
from sqlalchemy import text

import pandas as pd

router = APIRouter()
engine = create_db_connection()
connection = engine.connect()

# 로그인
@router.post("/login")
def login(params: dict):
    print(params)
    user_id = params["login_info"]["id"]
    password = params["login_info"]["password"]
    
    query=f"""
        SELECT id, name, job_position, company, email_address, phone_number, user_type
        FROM structure3.user_information
        WHERE id = "{user_id}" AND password = "{password}"
    """
    
    login_df = pd.read_sql(query, engine)
    
    return JSONResponse(login_df.to_json(force_ascii=False, orient="records"))

# 회원가입
@router.post("/sign_up")
def sign_up(params: dict):
    print (params)
    user_id = params["join_info"]["id"]
    password = params["join_info"]["password"]
    name = params["join_info"]["name"]
    job_position = params["join_info"]["job_position"]
    company = params["join_info"]["company"]
    email_address = params["join_info"]["email_address"]
    phone_number = params["join_info"]["phone_number"]
    user_type = params["join_info"]["user_type"]
    
    with Session(engine) as session:
        session.execute(
            text(
                """
                INSERT INTO user_information VALUES (:user_id, :password, :name, 
                :job_position, :company, :email_address, :phone_number, :user_type);
            """
            ),
            {"user_id": user_id, "password": password, "name": name, "job_position": job_position, 
            "company": company, "email_address": email_address, "phone_number": phone_number, 
            "user_type": user_type}
        )
    
        session.commit()
        
    return {"result": True}
    

# ID 중복성 검사
@router.post("/sign_up/check_id")
def check_id_validity(params: dict):
    user_id = params["id_info"]["id"]
    
    query = f"""
        SELECT COUNT(*) as count
        FROM structure3.user_information
        WHERE id = "{user_id}"
    """
    
    count = pd.read_sql(query, engine)
    
    if count["count"].iloc[0] != 0 :
        return {"result": False}
    else :
        return {"result": True}