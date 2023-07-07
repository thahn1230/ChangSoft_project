import pandas as pd
from fastapi import APIRouter
import pymysql
from pymysql.cursors import DictCursor
from sqlalchemy import create_engine, text
from sqlalchemy_utils import database_exists, create_database
import os
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt
import matplotlib.font_manager as fm
import plotly.express as px
import plotly.offline as py
import plotly.graph_objs as go
import plotly.utils
import random
import json
import plotly
import re
import plotly.figure_factory as ff
import plotly.graph_objects as go

from dbAccess import create_db_connection
from plotly.subplots import make_subplots

router = APIRouter()
engine = create_db_connection()

font_location = "./Others/malgun"  # For Windows , 맑은 고딕
font_name = fm.FontProperties(fname=font_location).get_name()
plt.rc("font", family=font_name)


def add_explanation(fig_json, explanation):
    # Load the fig_json as a Python dictionary
    fig_dict = json.loads(fig_json)

    # Add a new 'explanation' key-value pair to the dictionary
    fig_dict["explanation"] = explanation

    # Convert the dictionary back to json
    fig_json = json.dumps(fig_dict, cls=plotly.utils.PlotlyJSONEncoder)

    return fig_json


def get_material_values(project_name, building_name):
    # 각 빌딩의 concrete volume의 총합을 구하는 쿼리
    query_concrete = f"""
        SELECT 
        SUM(concrete.volume) AS total_concrete_volume
        FROM 
        building
        JOIN
        floor ON building.id = floor.building_id
        JOIN
        component ON floor.id = component.floor_id
        JOIN
        concrete ON component.id = concrete.component_id
        WHERE
        building.building_name = '{building_name}'
        AND
        building.project_id = (SELECT id FROM project WHERE project_name = '{project_name}')
        
    """

    # 각 빌딩의 rebar weight의 총합을 구하는 쿼리
    query_rebar = f"""
        SELECT 
        SUM(rebar.rebar_weight) AS total_rebar_weight
        FROM 
        building
        JOIN
        floor ON building.id = floor.building_id
        JOIN
        component ON floor.id = component.floor_id
        JOIN
        rebar ON component.id = rebar.component_id
        WHERE
        building.building_name = '{building_name}'
        AND
        building.project_id = (SELECT id FROM project WHERE project_name = '{project_name}')
    """

    # 각 빌딩의 formwork area의 총합을 구하는 쿼리
    query_formwork = f"""
        SELECT 
        SUM(formwork.area) AS total_formwork_area
        FROM 
        building
        JOIN
        floor ON building.id = floor.building_id
        JOIN
        component ON floor.id = component.floor_id
        JOIN
        formwork ON component.id = formwork.component_id
        WHERE
        building.building_name = '{building_name}'
        AND
        building.project_id = (SELECT id FROM project WHERE project_name = '{project_name}')
    """

    concrete = None
    rebar = None
    formwork = None

    try:
        concrete = pd.read_sql(query_concrete, engine)["total_concrete_volume"][0]
        rebar = pd.read_sql(query_rebar, engine)["total_rebar_weight"][0]
        formwork = pd.read_sql(query_formwork, engine)["total_formwork_area"][0]
    except Exception as e:
        print(f"An error occurred: {e}")

    # print(f"concrete:{concrete}, rebar:{rebar}, formwork:{formwork}")
    return concrete, rebar, formwork


def get_materials_data_by_company(construction_company, project_limit):
    # Get project names for the construction company '우미건설'
    query_projects = f"""
        SELECT project_name 
        FROM project 
        WHERE construction_company = '{construction_company}' 
        LIMIT {project_limit};
    """
    projects_df = pd.read_sql_query(query_projects, engine)
    project_names = projects_df["project_name"].tolist()

    # Iterate over project names and building names
    results = []
    for project_name in project_names:
        query_buildings = f"""
            SELECT building_name 
            FROM building 
            WHERE project_id = (SELECT id FROM project WHERE project_name = '{project_name}')
        """
        buildings_df = pd.read_sql_query(query_buildings, engine)
        building_names = buildings_df["building_name"].tolist()

        for building_name in building_names:
            concrete, rebar, formwork = get_material_values(project_name, building_name)
            results.append(
                {
                    "project_name": project_name,
                    "building_name": building_name,
                    "concrete": concrete,
                    "rebar": rebar,
                    "formwork": formwork,
                }
            )

    # Create a DataFrame from the results
    df = pd.DataFrame(results)
    df["rebar_per_conc"] = df["rebar"] / df["concrete"]
    return df


# Function to generate random colors
def random_color(n):
    return [
        "#%02x%02x%02x"
        % (random.randint(0, 255), random.randint(0, 255), random.randint(0, 255))
        for _ in range(n)
    ]


def generate_concrete_df(engine, project_name):
    concrete_query = f"""
    SELECT co.material_name, SUM(co.volume) AS total_concrete_volume
    FROM component AS comp
    JOIN concrete AS co ON comp.id = co.component_id
    JOIN floor AS f ON comp.floor_id = f.id
    JOIN building AS b ON f.building_id = b.id
    JOIN project AS p ON b.project_id = p.id
    WHERE p.project_name = '{project_name}'
    GROUP BY co.material_name
    """

    # 데이터베이스에서 데이터 가져오기 - concrete volume
    concrete_df = pd.read_sql_query(concrete_query, engine)
    concrete_df["volume_ratio"] = (
        concrete_df["total_concrete_volume"]
        / concrete_df["total_concrete_volume"].sum()
        * 100
    )
    concrete_df["project_name"] = project_name  # 프로젝트 이름 열 추가

    # volume_ratio를 기준으로 내림차순 정렬
    concrete_df = concrete_df.sort_values(by="volume_ratio", ascending=False)

    # 상위 5개 유지하고, 나머지를 합쳐서 'etc.'로 표시
    if len(concrete_df) > 5:
        top_5 = concrete_df.head(5)
        rest_sum = pd.DataFrame(
            {
                "material_name": ["etc."],
                "total_concrete_volume": [
                    concrete_df["total_concrete_volume"].iloc[5:].sum()
                ],
                "volume_ratio": [concrete_df["volume_ratio"].iloc[5:].sum()],
                "project_name": [project_name],  # 프로젝트 이름 열 추가
            }
        )
        concrete_df = pd.concat([top_5, rest_sum])

    return concrete_df


def extract_keywords(input_string):
    pattern = r"(CW|HW|EW|SW|TW|수벽|단차|파라펫|난간|방수턱|기타벽|흙막이벽)"  # Matches 'CW', 'HW', 'EW', 'SW' without following digits
    fallback_pattern = r"W"  # Matches 'W' without following digits

    # Search for the main pattern
    matches = re.search(pattern, input_string)

    # If no matches, use the fallback pattern
    if matches is None:
        matches = re.search(fallback_pattern, input_string)

    # If matches found, return the match, else return empty string
    if matches is not None:
        return matches.group(0)
    else:
        return "etc."


@router.get("/insight/1")
def get_insight_1():
    # 예제 1번
    # company_name의 모든 프로젝트에 있는 빌딩별, 콘크리트 M3당 철근량(ton) 값에 대한 분석
    # 그래프 1 : 빌딩별 콘크리트 M3당 철근량(ton) 값의 분포 히스토그램
    # 그래프 2 : 프로젝트별 콘크리트 M3당 철근량(ton) 값의 평균값 비교

    # 계산 로직
    company_name = "우미건설"
    df = get_materials_data_by_company(company_name, 5)
    # 그래프1
    # make plotly histogram chart
    # Create a histogram
    data = [go.Histogram(x=df["rebar_per_conc"], nbinsx=30, marker=dict(color="navy"))]

    # Create a layout
    layout = go.Layout(
        title_text=f"company_name, 빌딩별 콘크리트 볼륨(m^3)당 철근량(ton)의 분포표",
        title_font=dict(size=24, color="black"),
        xaxis_title="콘크리트 볼륨(m^3)당 철근량(ton)",
        yaxis_title="빈도(빌딩수)",
        bargap=0.1,  # gap between bars of adjacent location coordinates
    )

    # Create a fig from data and layout, and plot the fig
    fig = go.Figure(data=data, layout=layout)

    # Save the plot to HTML file
    # py.plot(fig, filename='histogram_plotly.html')
    fig_json = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)

    explanation = f"""이 그래프는 DB에 저장되어 있는 {company_name}이 실행한 모든 프로젝트에서의 빌딩 별 콘크리트 볼륨당 철근 사용량(ton)을 표시한 히스토그램입니다. 
    히스토그램은 데이터의 분포와 패턴을 시각화하는 데 사용되는 통계 그래프입니다. 이 경우, x축은 콘크리트 볼륨 당 철근의 양을 나타내고, y축은 해당 철근 사용량이 발생한 빌딩의 수, 즉 빈도를 나타냅니다. 
    각각의 막대는 콘크리트 볼륨당 철근의 양이 얼마나 자주 발생하는지를 나타내는 빈도를 표시하고 있습니다. 
    따라서, 이 히스토그램을 통해 우미건설의 프로젝트들에서 철근 사용량의 일반적인 분포와 트렌드를 쉽게 확인할 수 있습니다. 
    이 정보는 프로젝트의 자원 계획과 예산 설정에 중요한 역할을 할 수 있습니다."""
    fig_json = add_explanation(fig_json, explanation)

    # 그래프2

    # Calculate the average rebar_per_conc grouped by project_name
    rebar_per_conc_avg = (
        df.groupby("project_name")["rebar_per_conc"].mean().reset_index()
    )
    rebar_per_conc_avg["project_name_truncated"] = rebar_per_conc_avg[
        "project_name"
    ].str[:20]

    # Create a bar chart with different colors
    data = [
        go.Bar(
            x=rebar_per_conc_avg["project_name_truncated"],
            y=rebar_per_conc_avg["rebar_per_conc"],
            marker=dict(
                color=random_color(len(rebar_per_conc_avg["project_name_truncated"]))
            ),
        )
    ]

    # Create a layout
    layout = go.Layout(
        title=f"company_name, 프로젝트별 빌딩의 콘크리트 볼륨(m^3)당 철근량(ton)의 평균값",
        title_font=dict(size=24, color="black"),
        xaxis=dict(title="프로젝트명"),
        yaxis=dict(title="콘크리트 볼륨(m^3)당 철근량(ton)의 평균값"),
        autosize=False,
        width=1000,
        height=600,
        margin=go.layout.Margin(
            l=50,
            r=50,
            b=100,  # Adjust this value to change the space for x-axis labels
            t=100,
            pad=4,
        ),
    )

    # Create a fig from data and layout, and plot the fig
    fig2 = go.Figure(data=data, layout=layout)

    # Save the plot to HTML file
    # py.plot(fig, filename='average_rebar_per_conc_plotly.html')
    # Convert the figure to JSON
    fig_json2 = json.dumps(fig2, cls=plotly.utils.PlotlyJSONEncoder)

    explanation = f"""이 그래프는 DB에 저장된 {company_name}의 모든 프로젝트에 대한 빌딩별 콘크리트 볼륨(m³)당 철근 사용량(ton)의 평균값을 비교하고 있습니다.
    각 프로젝트에 대해 계산된 평균 철근 사용량이 표시되므로, 프로젝트 간에 철근 사용량의 차이를 쉽게 비교할 수 있습니다. 
    이 정보는 우미건설의 프로젝트 관리자가 프로젝트 간 자원 사용의 효율성을 비교하고, 더 효율적인 구조물 건설에 필요한 조치를 결정하는 데 도움이 될 수 있습니다. 
    이 비교를 통해, 어떤 프로젝트에서는 철근을 더 많이, 또는 더 적게 사용해야 하는지에 대한 통찰력을 얻을 수 있습니다. 
    이는 공사비용을 줄이고, 전체적인 프로젝트 실행을 개선하는 데 중요한 첫걸음이 될 수 있습니다."""
    fig_json = add_explanation(fig_json, explanation)

    # Load the jsons as Python dictionaries
    fig_dict1 = json.loads(fig_json)
    fig_dict2 = json.loads(fig_json2)

    # Create a new list that contains both figures
    figures = [fig_dict1, fig_dict2]

    # Convert the list to json
    figures_json = json.dumps(figures, cls=plotly.utils.PlotlyJSONEncoder)
    return figures_json


@router.get("/insight/2")
def get_insight_2():
    # 예제 2번
    # company_name의 모든 프로젝트에 대해, 프로젝트별 빌딩의 콘크리트 M3당 철근량(ton) 값의 분포 분석
    # 그래프 1 : 빌딩별 콘크리트 M3당 철근량(ton) 값의 Box plot 그래프

    company_name = "계룡건설"
    df = get_materials_data_by_company(company_name, 5)

    # Let's say 'df' is your original DataFrame
    fig = px.box(df, x="project_name", y="rebar_per_conc")
    # fig = px.box(df, x="project_name", y="rebar_per_conc", color="project_name", color_discrete_sequence=px.colors.sequential.Rainbow)

    # Customize the layout
    fig.update_layout(
        title=f"{company_name}, 프로젝트별 소속빌딩의 콘크리트 M3당 철근량(ton) 값의 분포 분석",
        title_font=dict(size=20, color="black"),
        xaxis_title="프로젝트명",
        yaxis_title="콘크리트 볼륨(m^3)당 철근량(ton)",
        autosize=False,
        width=900,
        height=600,
        showlegend=False,  # Disable legend
        margin=go.layout.Margin(
            l=50,
            r=50,
            b=100,  # Adjust this value to change the space for x-axis labels
            t=100,
            pad=4,
        ),
    )

    fig_json = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)

    explanation = f"""이 그래프는 {company_name}의 각 프로젝트에서 빌딩별 콘크리트 볼륨(m^3) 당 철근량(ton)의 분포를 시각화한 것입니다. 
    x축은 각각의 프로젝트를, y축은 콘크리트 볼륨당 철근량을 나타냅니다.
    이 그래프의 형태는 박스플롯(Box Plot)이며, 박스플롯은 데이터의 중앙값, 사분위수, 이상치 등의 통계적 분포를 한 눈에 보기 쉽게 표현해주는 그래프입니다. 
    박스의 중앙선은 중앙값을, 박스의 상단과 하단은 각각 3사분위수(Q3)와 1사분위수(Q1)를 나타냅니다. 
    박스의 위아래 선(수염)은 일반적으로 데이터의 전체 범위를 나타내며, 그 외의 점들은 이상치로 간주될 수 있습니다.
    따라서, 이 그래프를 통해 각 프로젝트에서의 콘크리트 볼륨당 철근량의 중앙값, 분포, 이상치 등을 쉽게 비교하고 이해할 수 있습니다. 
    이를 통해 각 프로젝트의 구조물 강도, 안전성 등을 추정하는 데 도움이 될 수 있습니다."""
    fig_json = add_explanation(fig_json, explanation)

    return fig_json


@router.get("/insight/3")
def get_insight_3():
    # 예제 3번
    # company_name의 4개 프로젝트에 대해, 프로젝트별 빌딩의 콘크리트 종류별 사용비율 비교
    # 그래프 1 : 프로젝트별 콘크리트 종류별 사용비율 비교 그래프

    # '우미건설'의 프로젝트 이름을 가져오는 쿼리
    company_name = "우미건설"

    project_name_query = f"""
    SELECT project_name
    FROM project
    WHERE construction_company = '{company_name}'
    LIMIT 4
    """
    project_names = pd.read_sql_query(project_name_query, engine)["project_name"]

    # 각 프로젝트에 대해 concrete_df 생성
    concrete_dfs = [
        generate_concrete_df(engine, project_name) for project_name in project_names
    ]

    # 2x2 subplot 생성
    fig = make_subplots(rows=2, cols=2, subplot_titles=project_names)  # 서브플롯에 제목 추가

    # 각 프로젝트별로 그래프 추가
    for i, df in enumerate(concrete_dfs, start=1):
        fig.add_trace(
            go.Bar(
                x=df["material_name"],
                y=df["total_concrete_volume"],
                showlegend=False,  # 레전드를 표시하지 않습니다
            ),
            row=(i - 1) // 2 + 1,
            col=(i - 1) % 2 + 1,
        )  # 각 subplot 위치 지정 (2x2 배열)

    fig.update_layout(
        title=f"{company_name}의 프로젝트별 콘크리트 구분에 따른 볼륨 분포 비교",
        title_font=dict(size=20, color="black"),
        xaxis_title="콘크리트 구분",
        yaxis_title="콘크리트 볼륨 (m^3)",
        width=900,
        height=800,  # 적절히 높이 조절
    )

    fig_json = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)

    explanation = f"""이 그래프는 {company_name}의 네 개 프로젝트에 대한 콘크리트 종류별 사용량 분포를 보여줍니다. 
    각 서브 그래프는 하나의 프로젝트를 나타내며, 서브 그래프의 제목은 해당 프로젝트의 이름입니다.
    각 서브 그래프에서 x축은 콘크리트의 종류, y축은 해당 콘크리트 종류의 볼륨(㎥)을 나타냅니다. 
    이를 통해 프로젝트마다 사용하는 콘크리트의 종류와 그 양을 비교하고 분석할 수 있습니다.
    특히 각 프로젝트에서 사용하는 콘크리트 종류의 분포는 해당 프로젝트의 특성이나 구조, 필요성 등을 반영할 수 있으므로, 
    이를 통해 프로젝트별 콘크리트 사용 트렌드와 패턴을 파악하는 데 도움이 될 수 있습니다.
    이 그래프는 건설 업계에서 물자 관리, 비용 추정, 그리고 건설 프로젝트의 효율성을 개선하는데 유용한 인사이트를 제공합니다."""

    fig_json = add_explanation(fig_json, explanation)

    return fig_json


@router.get("/insight/4")
def get_insight_4():
    # 예제 4번
    # 건설사별 콘크리트당 철근중량 비교
    # 그래프1 : 건설사별 콘크리트당 철근중량 비교

    # SQL 쿼리 작성 - construction_company 별 concrete volume 합계
    concrete_query = """
    SELECT p.construction_company, SUM(co.volume) AS total_concrete_volume
    FROM component AS comp
    JOIN concrete AS co ON comp.id = co.component_id
    JOIN floor AS f ON comp.floor_id = f.id
    JOIN building AS b ON f.building_id = b.id
    JOIN project AS p ON b.project_id = p.id
    GROUP BY p.construction_company
    """

    # SQL 쿼리 작성 - construction_company 별 rebar weight 합계
    rebar_query = """
    SELECT p.construction_company, SUM(r.rebar_weight) AS total_rebar_weight
    FROM component AS comp
    JOIN rebar AS r ON comp.id = r.component_id
    JOIN floor AS f ON comp.floor_id = f.id
    JOIN building AS b ON f.building_id = b.id
    JOIN project AS p ON b.project_id = p.id
    GROUP BY p.construction_company
    """

    # 데이터베이스에서 데이터 가져오기 - concrete volume
    concrete_df = pd.read_sql_query(concrete_query, engine)

    # 데이터베이스에서 데이터 가져오기 - rebar weight
    rebar_df = pd.read_sql_query(rebar_query, engine)

    # construction_company 별로 데이터 병합
    df = pd.merge(concrete_df, rebar_df, on="construction_company", how="outer")

    # rebar_weight_per_concrete_volume 계산
    df["rebar_weight_per_concrete_volume"] = (
        df["total_rebar_weight"] / df["total_concrete_volume"]
    )

    fig = px.bar(
        df,
        x="construction_company",
        y="rebar_weight_per_concrete_volume",
        color="construction_company",  # 바의 색상을 건설사에 따라 다르게 지정
        labels={
            "construction_company": "건설사",
            "rebar_weight_per_concrete_volume": "콘크리트당 철근중량 (ton/m^3)",
        },
        title="건설사 별 콘크리트당 철근중량 (ton/m^3)",
    )

    fig.update_layout(
        autosize=False,  # 자동 사이즈 조정 비활성화
        width=700,  # 그래프의 폭 지정
        height=500,
        title_font=dict(size=20, color="black"),  # 제목의 폰트 설정 변경
    )

    fig_json = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)

    # Add a new 'explanation' key-value pair to the dictionary
    explanation = """이 그래프는 각 건설사의 모든 프로젝트에서 철근 사용 효율성을 비교하는 것입니다. 
    각 바는 특정 건설사를 나타내며, 높이는 해당 건설사의 모든 프로젝트에서 사용한 철근의 무게를 콘크리트 볼륨 당 톤으로 나타낸 평균값입니다. 
    즉, 높이가 높을수록 해당 건설사의 프로젝트에서 더 많은 철근이 콘크리트 볼륨 당 사용되었음을 의미합니다.
    바의 색상은 건설사별로 다르게 표현되어, 어떤 건설사의 데이터인지 쉽게 구분할 수 있게 해줍니다. 
    이를 통해 각 건설사의 자원 관리 및 건설 효율성을 검토하는 데 도움이 될 수 있습니다. 
    그러나, 철근의 무게만으로 건설 효율성을 완전히 평가하는 것은 부적절할 수 있으니, 이 그래프는 여러 다른 지표들과 함께 종합적으로 해석되어야 합니다."""

    fig_json = add_explanation(fig_json, explanation)

    return fig_json


@router.get("/insight/5")
def get_insight_5():
    # Define the SQL query to load data where 'component_type' is '내력벽'
    query = """
    SELECT *
    FROM component
    WHERE component_type = '내력벽'
    """

    # Execute the SQL query and store the result in a DataFrame
    df = pd.read_sql_query(query, engine)

    df["group_name"] = df["section_name"].apply(extract_keywords)
    df

    # sql_query = """
    # SELECT component.*
    # FROM project
    # JOIN building ON project.id = building.project_id
    # JOIN floor ON building.id = floor.building_id
    # JOIN component ON floor.id = component.floor_id
    # WHERE project.construction_company = '우미건설'
    # AND component.component_type = '내력벽'
    # """
    sql_query = """
    SELECT component.*
    FROM (
        SELECT * FROM project
        WHERE construction_company = '우미건설'
        LIMIT 4
    ) AS limited_project
    JOIN building ON limited_project.id = building.project_id
    JOIN floor ON building.id = floor.building_id
    JOIN component ON floor.id = component.floor_id
    WHERE component.component_type = '내력벽'
    """
    # Execute the query and read the result into a pandas DataFrame
    df = pd.read_sql_query(sql_query, engine)

    # Apply the keyword extraction function to the 'section_name' column to create a new 'group_name' column
    df["group_name"] = df["section_name"].apply(extract_keywords)

    component_ids = df["id"].tolist()
    # Convert list to tuple for SQL IN clause
    component_ids_tuple = tuple(component_ids)

    # Define SQL queries to get sum of volume and rebar_weight for each component_id
    sql_query_concrete_vol = f"""
    SELECT c.component_id, SUM(c.volume) as concrete_vol
    FROM concrete c
    INNER JOIN component comp ON c.component_id = comp.id
    INNER JOIN floor f ON comp.floor_id = f.id
    INNER JOIN building b ON f.building_id = b.id
    INNER JOIN project p ON b.project_id = p.id
    WHERE p.construction_company = '우미건설' AND c.component_id IN {component_ids_tuple} /* 이미 component_ids_tuple이 '우미건설'을 통해 필터링된 것들이지만 여기서 다시 우미건설을 필터링하는 것이 훨씬 빠르다.*/
    GROUP BY c.component_id
    """
    sql_query_rebar_weight = f"""
    SELECT r.component_id, SUM(r.rebar_weight) as rebar_weight
    FROM rebar r
    INNER JOIN component comp ON r.component_id = comp.id
    INNER JOIN floor f ON comp.floor_id = f.id
    INNER JOIN building b ON f.building_id = b.id
    INNER JOIN project p ON b.project_id = p.id
    WHERE p.construction_company = '우미건설' AND r.component_id IN {component_ids_tuple}/* 이미 component_ids_tuple이 '우미건설'을 통해 필터링된 것들이지만 여기서 다시 우미건설을 필터링하는 것이 훨씬 빠르다.*/
    GROUP BY r.component_id
    """

    # Execute the queries and read the results into pandas DataFrames
    df_concrete_vol = pd.read_sql_query(sql_query_concrete_vol, engine)
    df_rebar_weight = pd.read_sql_query(sql_query_rebar_weight, engine)

    # Merge the results with the original DataFrame

    df = pd.merge(
        df, df_concrete_vol, left_on="id", right_on="component_id", how="left"
    )
    df = pd.merge(
        df, df_rebar_weight, left_on="id", right_on="component_id", how="left"
    )

    # Group df by 'group_name' and calculate the sum of 'concrete_vol' and 'rebar_weight'
    df_grouped = df.groupby("group_name").agg(
        concrete_vol_sum=("concrete_vol", "sum"),
        rebar_weight_sum=("rebar_weight", "sum"),
    )

    # Calculate 'rebar_weight_per_concrete' as the ratio of 'rebar_weight_sum' to 'concrete_vol_sum'
    df_grouped["rebar_weight_per_concrete"] = (
        df_grouped["rebar_weight_sum"] / df_grouped["concrete_vol_sum"]
    )

    # Create a new DataFrame with 'group_name', 'concrete_vol', 'rebar_weight', and 'rebar_weight_per_concrete'
    df_summary = df_grouped[
        ["concrete_vol_sum", "rebar_weight_sum", "rebar_weight_per_concrete"]
    ].reset_index()

    # Rename the columns
    df_summary.columns = [
        "group_name",
        "concrete_vol",
        "rebar_weight",
        "rebar_weight_per_concrete",
    ]

    fig = px.bar(
        df_summary,
        x="group_name",
        y="rebar_weight_per_concrete",
        title="'우미건설' 프로젝트에서 내력벽의 그루핑에 따른 콘크리트당 철근값의 비교",
        labels={
            "group_name": "내력벽 그룹명",
            "rebar_weight_per_concrete": "콘크리트당 철근량 (ton/m^3)",
        },
        color="group_name",  # 여기에서 Bar의 색을 group_name에 따라 다르게 지정
    )

    fig.update_traces(texttemplate="%{y:.3f}", textposition="outside")  # Bar 위에 값을 표시

    fig.update_layout(
        title_font=dict(size=20, color="black"),  # 제목의 폰트를 설정
        width=800,
        height=600,
        xaxis=dict(tickangle=-45),  # x축 레이블 회전
    )

    fig_json = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)

    # Add a new 'explanation' key-value pair to the dictionary
    explanation = """이 그래프는 '우미건설' 프로젝트에서 내력벽의 그루핑에 따른 콘크리트당 철근량의 비교를 나타냅니다. 
    내력벽은 서로 다른 역할을 수행하기 때문에 각각 다른 이름으로 그루핑되어 설계가 이루어집니다. 
    이 그래프를 통해 각 그룹의 콘크리트당 철근량 값이 어떻게 다른지 비교할 수 있습니다. 
    값이 높을수록 해당 그룹의 내력벽이 더 많은 철근을 필요로 하며, 값이 낮을수록 철근 사용량이 적습니다. 
    이를 통해 각 그룹별 내력벽의 설계 값의 차이를 시각적으로 확인할 수 있습니다.
    또 이 값들은 추후 구조설계가 이루어지지 않은 건물의 물량을 더 정확히 예측하는데 사용될 수 있습니다."""
    fig_json = add_explanation(fig_json, explanation)

    return fig_json


@router.get("/insight/6")
def get_insight_6():
    # 예제 6번
    # 층별, 부재타입별로 철근 타입별로 콘크리트당 철근사용량의 값을 한눈에 보여주는 히트맵 분석
    # 그래프 1 : 층별로 각각의 철근 타입에 대해서 콘크리트당 철근사용량의 값을 한눈에 보여주는 히트맵 분석
    # 그래프 2 : 부재타입별로 각각의 철근 타입에 대해서 콘크리트당 철근사용량의 값을 한눈에 보여주는 히트맵 분석

    project_name = "신세계_어바인시티"  # Replace with your project name
    building_name = "1bl_고층부"  # Replace with your building name

    query = f"""
    SELECT fl.floor_name, fl.floor_number, r.rebar_type, SUM(r.rebar_weight) as total_rebar_weight
    FROM rebar r
    INNER JOIN component comp ON r.component_id = comp.id
    INNER JOIN floor fl ON comp.floor_id = fl.id
    INNER JOIN building b ON fl.building_id = b.id
    INNER JOIN project p ON b.project_id = p.id
    WHERE p.project_name = '{project_name}' AND b.building_name = '{building_name}'
    GROUP BY fl.floor_name, fl.floor_number, r.rebar_type
    """

    # Execute the query and create a DataFrame
    df = pd.read_sql_query(query, engine)

    # Pivot the DataFrame to prepare it for the heatmap
    pivot_df = df.pivot(
        index="floor_name", columns="rebar_type", values="total_rebar_weight"
    )

    # Sorting by floor_number
    pivot_df["floor_number"] = df["floor_number"]
    pivot_df.sort_values("floor_number", ascending=False, inplace=True)
    pivot_df.drop("floor_number", axis=1, inplace=True)

    # Prepare data for heatmap
    z_data = np.log10(pivot_df.values)  # Apply log scale
    x_data = list(pivot_df.columns)
    y_data = list(pivot_df.index)

    # Define heatmap
    heatmap = go.Heatmap(
        z=z_data, x=x_data, y=y_data, colorscale="RdBu_r", showscale=True
    )

    # Create empty annotations
    # annotations = []

    # Create a mask for NaN values to avoid annotations on NaN values
    mask = np.isnan(z_data)

    annotation_text = [
        [f"{val:.2f}" if not mask[i, j] else "" for j, val in enumerate(row)]
        for i, row in enumerate(z_data)
    ]

    # Create annotations
    annotations = []
    for i, row in enumerate(annotation_text):
        for j, val in enumerate(row):
            annotations.append(
                go.layout.Annotation(
                    text=val, x=j, y=i, xref="x1", yref="y1", showarrow=False
                )
            )

    # Create layout with annotations
    layout = go.Layout(
        annotations=annotations,
        plot_bgcolor="rgba(0,0,0,0)",
        width=1400,
        height=1400,
        # paper_bgcolor='rgba(0,0,0,0)',
        xaxis=dict(
            gridcolor="lightgray",
            showline=True,
            linecolor="black",
            linewidth=2,
            tickangle=-90,
        ),
        yaxis=dict(
            gridcolor="lightgray", showline=True, linecolor="black", linewidth=2
        ),
    )

    # Create figure and add heatmap
    fig = go.Figure(data=[heatmap], layout=layout)

    fig_json = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)
    explanation = f"""이 히트맵은 {project_name}의 {building_name}에 대해 각 층별로 사용된 철근의 무게를 콘크리트 볼륨 당 철근의 무게로 나타냅니다. X축은 철근의 타입을, Y축은 건물의 각 층을 나타냅니다.
    색의 진하기는 값을 로그 스케일로 표현하며, 색이 진할수록 콘크리트 볼륨 당 더 많은 무게의 철근이 사용되었음을 의미합니다. 로그 스케일은 철근의 무게가 크게 다른 경우에도 모든 정보를 명확하게 표시하도록 해줍니다.
    이 정보를 통해 건축팀은 각 층에서 어떤 종류의 철근이 얼마나 사용되었는지, 어떤 층에서 철근의 사용량이 많았는지 등을 한눈에 파악할 수 있습니다. 이는 효율적인 자원 관리와 계획을 수립하는 데 도움이 될 것입니다."""
    fig_json = add_explanation(fig_json, explanation)

    query = f"""
    SELECT comp.component_type, r.rebar_type, SUM(r.rebar_weight) as total_rebar_weight
    FROM rebar r
    INNER JOIN component comp ON r.component_id = comp.id
    INNER JOIN floor fl ON comp.floor_id = fl.id
    INNER JOIN building b ON fl.building_id = b.id
    INNER JOIN project p ON b.project_id = p.id
    WHERE p.project_name = '{project_name}' AND b.building_name = '{building_name}'
    GROUP BY comp.component_type, r.rebar_type
    """

    # Execute the query and create a DataFrame
    df = pd.read_sql_query(query, engine)
    pivot_df = df.pivot(
        index="component_type", columns="rebar_type", values="total_rebar_weight"
    )

    # Prepare data for heatmap
    z_data = np.log10(pivot_df.values)  # Apply log scale
    x_data = list(pivot_df.columns)
    y_data = list(pivot_df.index)

    # Define heatmap
    heatmap = go.Heatmap(
        z=z_data, x=x_data, y=y_data, colorscale="RdBu_r", showscale=True
    )

    # Create a mask for NaN values to avoid annotations on NaN values
    mask = np.isnan(z_data)

    annotation_text = [
        [f"{val:.2f}" if not mask[i, j] else "" for j, val in enumerate(row)]
        for i, row in enumerate(z_data)
    ]

    # Create annotations
    annotations = []
    for i, row in enumerate(annotation_text):
        for j, val in enumerate(row):
            annotations.append(
                go.layout.Annotation(
                    text=val, x=j, y=i, xref="x1", yref="y1", showarrow=False
                )
            )

    # Create layout with annotations
    layout = go.Layout(
        annotations=annotations,
        plot_bgcolor="rgba(0,0,0,0)",
        width=1400,
        # paper_bgcolor='rgba(0,0,0,0)',
        xaxis=dict(
            gridcolor="lightgray",
            showline=True,
            linecolor="black",
            linewidth=2,
            tickangle=-90,
        ),
        yaxis=dict(
            gridcolor="lightgray", showline=True, linecolor="black", linewidth=2
        ),
    )

    # Create figure and add heatmap
    fig = go.Figure(data=[heatmap], layout=layout)

    fig_json = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)
    explanation = f"""이 히트맵은 {project_name}의 {building_name}에 대해 부재 타입별로 사용된 철근의 무게를 콘크리트 볼륨 당 철근의 무게로 나타냅니다. X축은 철근의 타입을, Y축은 부재 타입을 나타냅니다.
    색의 진하기는 값을 로그 스케일로 표현하며, 색이 진할수록 콘크리트 볼륨 당 더 많은 무게의 철근이 사용되었음을 의미합니다. 로그 스케일은 철근의 무게가 크게 다른 경우에도 모든 정보를 명확하게 표시하도록 해줍니다.
    이 정보를 통해 건축팀은 각 부재별로 어떤 종류의 철근이 얼마나 사용되었는지, 어떤 부재에서 철근의 사용량이 많았는지 등을 한눈에 파악할 수 있습니다. 이는 효율적인 자원 관리와 계획을 수립하는 데 도움이 될 것입니다."""
    fig_json = add_explanation(fig_json, explanation)

    return fig_json
