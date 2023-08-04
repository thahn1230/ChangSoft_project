import openai


APIkey = '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'

imports = '''
    currently, python libraries imported are the following:
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
'''
code_condition = '''
    The database is MySQL and I use SQLAlchemy and Pandas. \
    The graph will be rendered with Plotly. All the libraries are already imported, \
    and the engine and connection for SQLAlchemy are globally defined as 'engine' and 'connection'. \
    Therefore, there's no need for you to import any library or establish the DB connection; you can just use the 'engine' and 'connection'. \
    when you make sql string for sqlalchemy you should write like "sql_query = text(SQL_STRING)"
    Always join with the project when you are looking for information about a building. Similarly, when searching for any information, understand the relationship between the tables and use joins to gather the information.
    Your code should be able to provide the answer to the question, and within your code, the answer to the question should be stored in a local variable called 'answer'.
    When you are asked to draw Graph in provided condition, use plotly module to generate the graph's information and use json.dumps to convert into json format. Use the data that derived from the query. You have to put the original json data to local variable called "answer".
'''
db_explanation ='''
    builderhub DB(빌더허브 DB) is about detailed quntities of reinforced concrete(철근 콘크리트) building structure. \
    builderhub DB contains construction projects, their companies, the buildings within them,\
    as well as all the components within the buildings, and the materials used therein. That is detailed data on rebar, concrete,\
    and formwork are included. \
    --------------------------------------
    * builderHub DB에 대한 부연설명
    1. 건설회사 (construction_company)에는 우미건설, 계룡건설, 삼성물산, 현대건설, 신세계건설, KCC건설, 동부건설, 현대엔지니어링, 동부건설 등이 있어.
    2. 건설 프로젝트(project)에는 여러개의 빌딩(building)들이 있고, 그 빌딩들은 그 건물을 구성하는 부재(component)로 이루어져.
    3. 부재(component)는 슬래브, 벽(wall), 기둥(column), 보(beam), 내력벽(bearing wall), 피트(pit), 난간벽, 매트슬래브, 기초, 계단, 옹벽, 데크 등의 종류가 있어  
    4. 부재들은 부재가 속하는 층(floor) 정보와 건물(sub_building)정보를 가지고 있어서 그것을 통해 소속 빌딩을 찾을 수 있어.
    5. 프로젝트와 빌딩을 혼동하지마. 프로젝트는 여러개의 빌딩으로 구성되고, 빌딩은 하나의 프로젝트에 소속되어 있어. 질문에서 빌딩의 갯수를 물었다면, building 테이블에서 찾아야 하는 거야.
    6. 연면적 : total_area, 건설면적 : building_area, 층면적: floor_area
    --------------------------------------
'''
db_schema = '''
    The schema of the builderhub DB is as follows:
    # 테이블 생성 및 처리
    tables = [
        {
            "table_name": "project",
            "sql_create": """
            CREATE TABLE IF NOT EXISTS project (
                id INT AUTO_INCREMENT PRIMARY KEY,
                project_name VARCHAR(255) UNIQUE,
                /*screenshot VARCHAR(255),*/
                construction_company VARCHAR(255),
                zone VARCHAR(255),
                location VARCHAR(255),
                building_area DOUBLE,
                total_area DOUBLE,                
                seismic_coefficient FLOAT,
                wind_exposure_cat ENUM('A','B','C','D'),
                wind_tunnel_test ENUM('Y', 'N'),
                rainfall FLOAT,
                ground_characteristics FLOAT,
                construction_start DATE,
                construction_end DATE,
                `usage` VARCHAR(255),
                created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );
        """,
        },
        {
            "table_name": "building",
            "sql_create": """
            CREATE TABLE IF NOT EXISTS building (
                id INT AUTO_INCREMENT PRIMARY KEY,
                building_name VARCHAR(255), /*bhb file name*/                
                screenshot VARCHAR(255), /*screenshot url*/
                total_area FLOAT, /*pre-calculated from floor areas*/
                stories_above INT, /*pre-calculated from floors*/
                stories_below INT, /*pre-calculated from floors*/
                height_above FLOAT, /*pre-calculated from floors*/
                height_below FLOAT,/*pre-calculated from floors*/
                construction_method VARCHAR(255),
                structure_type VARCHAR(255),
                top_down ENUM('Y', 'N'),
                plane_shape VARCHAR(255),                
                foundation_type VARCHAR(255),
                structure_code VARCHAR(255),
                performance_design_target ENUM('Y', 'N'),
                has_underground BOOL,
                project_id INT,
                created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (project_id) REFERENCES project(id)
            );
        """,
        },
        {
            "table_name": "sub_building", #공사개요 내 건물 분류 정보
            "sql_create": """
            CREATE TABLE IF NOT EXISTS sub_building (
            id INT AUTO_INCREMENT PRIMARY KEY,
            sub_building_type VARCHAR(255),
            sub_building_category VARCHAR(255),
            sub_building_name VARCHAR(255),
            total_area_above FLOAT,
            total_area_below FLOAT,
            building_id INT,
            FOREIGN KEY (building_id) REFERENCES building(id)
            );
        """,
        },  
        {
            "table_name": "floor",
            "sql_create": """
            CREATE TABLE IF NOT EXISTS floor (
                id INT AUTO_INCREMENT PRIMARY KEY,
                floor_number INT,
                floor_name VARCHAR(255),
                floor_type VARCHAR(255),
                floor_category VARCHAR(255),
                floor_height FLOAT,
                floor_area FLOAT,
                floor_perimeter FLOAT,
                building_id INT,
                FOREIGN KEY (building_id) REFERENCES building(id),
                INDEX (building_id)
            );
        """,
        },         
        {
            "table_name": "component",
            "sql_create": """
            CREATE TABLE IF NOT EXISTS component (
                id INT AUTO_INCREMENT PRIMARY KEY,
                object_id INT,/*builderhub MS_ID*/
                floor_id INT,
                sub_building_id INT,
                component_type VARCHAR(255),/* CompoG_Type*/
                section_name VARCHAR(255), /* CompoM name*/
                construction_zone VARCHAR(255),
                category VARCHAR(255), /*분류명 not used*/                
                FOREIGN KEY (sub_building_id) REFERENCES sub_building(id),
                FOREIGN KEY (floor_id) REFERENCES floor(id),
                INDEX (floor_id)
            );
        """,
        },
        {
            "table_name": "concrete",
            "sql_create": """
            CREATE TABLE IF NOT EXISTS concrete (
                id INT AUTO_INCREMENT PRIMARY KEY,                
                component_id INT,               
                summation_type VARCHAR(255), /*분류 : 콘크리트,콘크리트(합산) etc.*/
                blinding VARCHAR(255), /*구성 : 철콘,버림 , 버림(blinding)이냐 아니냐로 구분*/
                calculation_formula VARCHAR(4095),
                /* "재질명","굵은골재","Conc_강도","슬럼프","골재-강도-슬럼프","체적" */
                material_name VARCHAR(255),
                coarse_aggregate VARCHAR(8),
                concrete_strength VARCHAR(8),
                slump VARCHAR(8),
                aggregate_strength_concrete_strength_slump VARCHAR(32),
                volume FLOAT,                
                FOREIGN KEY (component_id) REFERENCES component(id),
                INDEX (component_id)
            );
        """,
        },
    
        {
            "table_name": "formwork",
            "sql_create": """
            CREATE TABLE IF NOT EXISTS formwork (
                id INT AUTO_INCREMENT PRIMARY KEY,
                component_id INT,
                calculation_formula VARCHAR(4095),
                formwork_position VARCHAR(255),
                formwork_type VARCHAR(255),
                area FLOAT, 
                FOREIGN KEY (component_id) REFERENCES component(id),
                INDEX (component_id)
            );
        """,
        },
        {
            "table_name": "rebar",
            "sql_create": """
            CREATE TABLE IF NOT EXISTS rebar (
                id INT AUTO_INCREMENT PRIMARY KEY,
                component_id INT,
                calculation_formula VARCHAR(4095),
                rebar_type VARCHAR(255),
                rebar_grade VARCHAR(255),
                rebar_diameter FLOAT,
                rebar_shape_count INT,
                rebar_shape_length FLOAT,
                rebar_unit_weight FLOAT, /* ton */
                rebar_id INT,
                rebar_count INT,
                rebar_weight FLOAT, /* ton */
                FOREIGN KEY (component_id) REFERENCES component(id),
                INDEX (component_id)
            );
        """,
        },
    ]
'''
db_query_example ='''
    # {company_name}에서 지은 빌딩의 층고에 따른 빌딩의 수를 가져오는 쿼리
    query = """
    SELECT floor.floor_height AS floor_height, COUNT(DISTINCT building.id) AS num_buildings
    FROM floor
    INNER JOIN building ON floor.building_id = building.id
    INNER JOIN project ON building.project_id = project.id
    WHERE project.construction_company = {company_name}
    GROUP BY floor.floor_height
    """

    # 프로젝트별 콘크리트 부피 계산 쿼리
    query_concrete = """
    SELECT project.project_name,
    SUM(concrete.volume) AS total_concrete_volume
    FROM project
    LEFT JOIN building ON building.project_id = project.id
    LEFT JOIN floor ON floor.building_id = building.id
    LEFT JOIN component ON component.floor_id = floor.id
    LEFT JOIN concrete ON concrete.component_id = component.id
    WHERE project.construction_company = {company_name}
    GROUP BY project.project_name
    """

    # 프로젝트별 철근 무게 계산 쿼리
    query_rebar = """
    SELECT project.project_name,
    SUM(rebar.rebar_weight) AS total_rebar_weight
    FROM project
    LEFT JOIN building ON building.project_id = project.id
    LEFT JOIN floor ON floor.building_id = building.id
    LEFT JOIN component ON component.floor_id = floor.id
    LEFT JOIN rebar ON rebar.component_id = component.id
    WHERE project.construction_company = {company_name}
    GROUP BY project.project_name
    """

    #층별, 부재타입별로 철근 타입별로 콘크리트당 철근사용량의 값
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

'''
# plotly_data_example='''[{"data":[{"marker":{"color":"navy"},"nbinsx":30,"x":[0.07679125644375462],"type":"histogram"}],"layout":{"autosize":false,"bargap":0.1,"height":720,"title":{"font":{"color":"black","size":24},"text":"현대엔지니어링, 빌딩별 콘크리트 볼륨(㎥)당 철근량(ton)의 분포표"},"width":1200,"xaxis":{"title":{"text":"콘크리트 볼륨(㎥)당 철근량(ton)"},"type":"linear","range":[0,1],"autorange":true},"yaxis":{"title":{"text":"빈도(빌딩수)"},"range":[0,1.0526315789473684],"autorange":true},"template":{"data":{"histogram2dcontour":[{"type":"histogram2dcontour","colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1,"#f0f921"]]}],"choropleth":[{"type":"choropleth","colorbar":{"outlinewidth":0,"ticks":""}}],"histogram2d":[{"type":"histogram2d","colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1,"#f0f921"]]}],"heatmap":[{"type":"heatmap","colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1,"#f0f921"]]}],"heatmapgl":[{"type":"heatmapgl","colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1,"#f0f921"]]}],"contourcarpet":[{"type":"contourcarpet","colorbar":{"outlinewidth":0,"ticks":""}}],"contour":[{"type":"contour","colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1,"#f0f921"]]}],"surface":[{"type":"surface","colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1,"#f0f921"]]}],"mesh3d":[{"type":"mesh3d","colorbar":{"outlinewidth":0,"ticks":""}}],"scatter":[{"fillpattern":{"fillmode":"overlay","size":10,"solidity":0.2},"type":"scatter"}],"parcoords":[{"type":"parcoords","line":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"scatterpolargl":[{"type":"scatterpolargl","marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"bar":[{"error_x":{"color":"#2a3f5f"},"error_y":{"color":"#2a3f5f"},"marker":{"line":{"color":"#E5ECF6","width":0.5},"pattern":{"fillmode":"overlay","size":10,"solidity":0.2}},"type":"bar"}],"scattergeo":[{"type":"scattergeo","marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"scatterpolar":[{"type":"scatterpolar","marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"histogram":[{"marker":{"pattern":{"fillmode":"overlay","size":10,"solidity":0.2}},"type":"histogram"}],"scattergl":[{"type":"scattergl","marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"scatter3d":[{"type":"scatter3d","line":{"colorbar":{"outlinewidth":0,"ticks":""}},"marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"scattermapbox":[{"type":"scattermapbox","marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"scatterternary":[{"type":"scatterternary","marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"scattercarpet":[{"type":"scattercarpet","marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"carpet":[{"aaxis":{"endlinecolor":"#2a3f5f","gridcolor":"white","linecolor":"white","minorgridcolor":"white","startlinecolor":"#2a3f5f"},"baxis":{"endlinecolor":"#2a3f5f","gridcolor":"white","linecolor":"white","minorgridcolor":"white","startlinecolor":"#2a3f5f"},"type":"carpet"}],"table":[{"cells":{"fill":{"color":"#EBF0F8"},"line":{"color":"white"}},"header":{"fill":{"color":"#C8D4E3"},"line":{"color":"white"}},"type":"table"}],"barpolar":[{"marker":{"line":{"color":"#E5ECF6","width":0.5},"pattern":{"fillmode":"overlay","size":10,"solidity":0.2}},"type":"barpolar"}],"pie":[{"automargin":true,"type":"pie"}]},"layout":{"autotypenumbers":"strict","colorway":["#636efa","#EF553B","#00cc96","#ab63fa","#FFA15A","#19d3f3","#FF6692","#B6E880","#FF97FF","#FECB52"],"font":{"color":"#2a3f5f"},"hovermode":"closest","hoverlabel":{"align":"left"},"paper_bgcolor":"white","plot_bgcolor":"#E5ECF6","polar":{"bgcolor":"#E5ECF6","angularaxis":{"gridcolor":"white","linecolor":"white","ticks":""},"radialaxis":{"gridcolor":"white","linecolor":"white","ticks":""}},"ternary":{"bgcolor":"#E5ECF6","aaxis":{"gridcolor":"white","linecolor":"white","ticks":""},"baxis":{"gridcolor":"white","linecolor":"white","ticks":""},"caxis":{"gridcolor":"white","linecolor":"white","ticks":""}},"coloraxis":{"colorbar":{"outlinewidth":0,"ticks":""}},"colorscale":{"sequential":[[0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1,"#f0f921"]],"sequentialminus":[[0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1,"#f0f921"]],"diverging":[[0,"#8e0152"],[0.1,"#c51b7d"],[0.2,"#de77ae"],[0.3,"#f1b6da"],[0.4,"#fde0ef"],[0.5,"#f7f7f7"],[0.6,"#e6f5d0"],[0.7,"#b8e186"],[0.8,"#7fbc41"],[0.9,"#4d9221"],[1,"#276419"]]},"xaxis":{"gridcolor":"white","linecolor":"white","ticks":"","title":{"standoff":15},"zerolinecolor":"white","automargin":true,"zerolinewidth":2},"yaxis":{"gridcolor":"white","linecolor":"white","ticks":"","title":{"standoff":15},"zerolinecolor":"white","automargin":true,"zerolinewidth":2},"scene":{"xaxis":{"backgroundcolor":"#E5ECF6","gridcolor":"white","linecolor":"white","showbackground":true,"ticks":"","zerolinecolor":"white","gridwidth":2},"yaxis":{"backgroundcolor":"#E5ECF6","gridcolor":"white","linecolor":"white","showbackground":true,"ticks":"","zerolinecolor":"white","gridwidth":2},"zaxis":{"backgroundcolor":"#E5ECF6","gridcolor":"white","linecolor":"white","showbackground":true,"ticks":"","zerolinecolor":"white","gridwidth":2}},"shapedefaults":{"line":{"color":"#2a3f5f"}},"annotationdefaults":{"arrowcolor":"#2a3f5f","arrowhead":0,"arrowwidth":1},"geo":{"bgcolor":"white","landcolor":"#E5ECF6","subunitcolor":"white","showland":true,"showlakes":true,"lakecolor":"white"},"title":{"x":0.05},"mapbox":{"style":"light"}}}},"explanation":"이 그래프는 DB에 저장되어 있는 현대엔지니어링이 실행한 모든 프로젝트에서의 빌딩 별 콘크리트 볼륨당 철근 사용량(ton)을 표시한 히스토그램입니다. \n    히스토그램은 데이터의 분포와 패턴을 시각화하는 데 사용되는 통계 그래프입니다. 이 경우, x축은 콘크리트 볼륨 당 철근의 양을 나타내고, y축은 해당 철근 사용량이 발생한 빌딩의 수, 즉 빈도를 나타냅니다. \n    각각의 막대는 콘크리트 볼륨당 철근의 양이 얼마나 자주 발생하는지를 나타내는 빈도를 표시하고 있습니다. \n    따라서, 이 히스토그램을 통해 우미건설의 프로젝트들에서 철근 사용량의 일반적인 분포와 트렌드를 쉽게 확인할 수 있습니다. \n    이 정보는 프로젝트의 자원 계획과 예산 설정에 중요한 역할을 할 수 있습니다."},{"data":[{"marker":{"color":["#a7ec61"]},"x":["DK TOWER 지식산업센터 신축공사"],"y":[0.07679125644375462],"type":"bar"}],"layout":{"autosize":false,"height":720,"margin":{"b":100,"l":50,"pad":4,"r":50,"t":100},"title":{"font":{"color":"black","size":24},"text":"현대엔지니어링, 프로젝트별 빌딩의 콘크리트 볼륨(㎥)당 철근량(ton)의 평균값"},"width":1200,"xaxis":{"title":{"text":"프로젝트명"},"type":"category","range":[-0.5,0.5],"autorange":true},"yaxis":{"title":{"text":"콘크리트 볼륨(㎥)당 철근량(ton)의 평균값"},"type":"linear","range":[0,0.0808329015197417],"autorange":true},"template":{"data":{"histogram2dcontour":[{"type":"histogram2dcontour","colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1,"#f0f921"]]}],"choropleth":[{"type":"choropleth","colorbar":{"outlinewidth":0,"ticks":""}}],"histogram2d":[{"type":"histogram2d","colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1,"#f0f921"]]}],"heatmap":[{"type":"heatmap","colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1,"#f0f921"]]}],"heatmapgl":[{"type":"heatmapgl","colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1,"#f0f921"]]}],"contourcarpet":[{"type":"contourcarpet","colorbar":{"outlinewidth":0,"ticks":""}}],"contour":[{"type":"contour","colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1,"#f0f921"]]}],"surface":[{"type":"surface","colorbar":{"outlinewidth":0,"ticks":""},"colorscale":[[0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1,"#f0f921"]]}],"mesh3d":[{"type":"mesh3d","colorbar":{"outlinewidth":0,"ticks":""}}],"scatter":[{"fillpattern":{"fillmode":"overlay","size":10,"solidity":0.2},"type":"scatter"}],"parcoords":[{"type":"parcoords","line":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"scatterpolargl":[{"type":"scatterpolargl","marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"bar":[{"error_x":{"color":"#2a3f5f"},"error_y":{"color":"#2a3f5f"},"marker":{"line":{"color":"#E5ECF6","width":0.5},"pattern":{"fillmode":"overlay","size":10,"solidity":0.2}},"type":"bar"}],"scattergeo":[{"type":"scattergeo","marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"scatterpolar":[{"type":"scatterpolar","marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"histogram":[{"marker":{"pattern":{"fillmode":"overlay","size":10,"solidity":0.2}},"type":"histogram"}],"scattergl":[{"type":"scattergl","marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"scatter3d":[{"type":"scatter3d","line":{"colorbar":{"outlinewidth":0,"ticks":""}},"marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"scattermapbox":[{"type":"scattermapbox","marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"scatterternary":[{"type":"scatterternary","marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"scattercarpet":[{"type":"scattercarpet","marker":{"colorbar":{"outlinewidth":0,"ticks":""}}}],"carpet":[{"aaxis":{"endlinecolor":"#2a3f5f","gridcolor":"white","linecolor":"white","minorgridcolor":"white","startlinecolor":"#2a3f5f"},"baxis":{"endlinecolor":"#2a3f5f","gridcolor":"white","linecolor":"white","minorgridcolor":"white","startlinecolor":"#2a3f5f"},"type":"carpet"}],"table":[{"cells":{"fill":{"color":"#EBF0F8"},"line":{"color":"white"}},"header":{"fill":{"color":"#C8D4E3"},"line":{"color":"white"}},"type":"table"}],"barpolar":[{"marker":{"line":{"color":"#E5ECF6","width":0.5},"pattern":{"fillmode":"overlay","size":10,"solidity":0.2}},"type":"barpolar"}],"pie":[{"automargin":true,"type":"pie"}]},"layout":{"autotypenumbers":"strict","colorway":["#636efa","#EF553B","#00cc96","#ab63fa","#FFA15A","#19d3f3","#FF6692","#B6E880","#FF97FF","#FECB52"],"font":{"color":"#2a3f5f"},"hovermode":"closest","hoverlabel":{"align":"left"},"paper_bgcolor":"white","plot_bgcolor":"#E5ECF6","polar":{"bgcolor":"#E5ECF6","angularaxis":{"gridcolor":"white","linecolor":"white","ticks":""},"radialaxis":{"gridcolor":"white","linecolor":"white","ticks":""}},"ternary":{"bgcolor":"#E5ECF6","aaxis":{"gridcolor":"white","linecolor":"white","ticks":""},"baxis":{"gridcolor":"white","linecolor":"white","ticks":""},"caxis":{"gridcolor":"white","linecolor":"white","ticks":""}},"coloraxis":{"colorbar":{"outlinewidth":0,"ticks":""}},"colorscale":{"sequential":[[0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1,"#f0f921"]],"sequentialminus":[[0,"#0d0887"],[0.1111111111111111,"#46039f"],[0.2222222222222222,"#7201a8"],[0.3333333333333333,"#9c179e"],[0.4444444444444444,"#bd3786"],[0.5555555555555556,"#d8576b"],[0.6666666666666666,"#ed7953"],[0.7777777777777778,"#fb9f3a"],[0.8888888888888888,"#fdca26"],[1,"#f0f921"]],"diverging":[[0,"#8e0152"],[0.1,"#c51b7d"],[0.2,"#de77ae"],[0.3,"#f1b6da"],[0.4,"#fde0ef"],[0.5,"#f7f7f7"],[0.6,"#e6f5d0"],[0.7,"#b8e186"],[0.8,"#7fbc41"],[0.9,"#4d9221"],[1,"#276419"]]},"xaxis":{"gridcolor":"white","linecolor":"white","ticks":"","title":{"standoff":15},"zerolinecolor":"white","automargin":true,"zerolinewidth":2},"yaxis":{"gridcolor":"white","linecolor":"white","ticks":"","title":{"standoff":15},"zerolinecolor":"white","automargin":true,"zerolinewidth":2},"scene":{"xaxis":{"backgroundcolor":"#E5ECF6","gridcolor":"white","linecolor":"white","showbackground":true,"ticks":"","zerolinecolor":"white","gridwidth":2},"yaxis":{"backgroundcolor":"#E5ECF6","gridcolor":"white","linecolor":"white","showbackground":true,"ticks":"","zerolinecolor":"white","gridwidth":2},"zaxis":{"backgroundcolor":"#E5ECF6","gridcolor":"white","linecolor":"white","showbackground":true,"ticks":"","zerolinecolor":"white","gridwidth":2}},"shapedefaults":{"line":{"color":"#2a3f5f"}},"annotationdefaults":{"arrowcolor":"#2a3f5f","arrowhead":0,"arrowwidth":1},"geo":{"bgcolor":"white","landcolor":"#E5ECF6","subunitcolor":"white","showland":true,"showlakes":true,"lakecolor":"white"},"title":{"x":0.05},"mapbox":{"style":"light"}}}},"explanation":"이 그래프는 DB에 저장된 현대엔지니어링의 모든 프로젝트에 대한 빌딩별 콘크리트 볼륨(m³)당 철근 사용량(ton)의 평균값을 비교하고 있습니다.\n    각 프로젝트에 대해 계산된 평균 철근 사용량이 표시되므로, 프로젝트 간에 철근 사용량의 차이를 쉽게 비교할 수 있습니다. \n    이 정보는 우미건설의 프로젝트 관리자가 프로젝트 간 자원 사용의 효율성을 비교하고, 더 효율적인 구조물 건설에 필요한 조치를 결정하는 데 도움이 될 수 있습니다. \n    이 비교를 통해, 어떤 프로젝트에서는 철근을 더 많이, 또는 더 적게 사용해야 하는지에 대한 통찰력을 얻을 수 있습니다. \n    이는 공사비용을 줄이고, 전체적인 프로젝트 실행을 개선하는 데 중요한 첫걸음이 될 수 있습니다."}]'''

######### add_middleware.py

from fastapi.middleware.cors import CORSMiddleware
from origins import origins

def add_middleware(app):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
