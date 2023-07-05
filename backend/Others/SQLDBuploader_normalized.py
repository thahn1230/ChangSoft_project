import pandas as pd
import pymysql
from pymysql.cursors import DictCursor
from sqlalchemy import create_engine, text
from sqlalchemy_utils import database_exists, create_database
import os

# project info
# 1. 이름(현장명)
# 2. 3D 조감도(스크린샷) → url
# 3. 건설사
# 4. 지역지구(제2종 일반거주 지역 등)
# 5. 지역(대구광역시)
# 6. 연면적 (설계도값/신고된 값)
# 7. 구조기준
# 8. 성능설계대상(Y/N)
# 9. 지진계수
# 10. 풍속(노풍도)
# 11. 풍동실험 대상(Y/N)
# 12. 강수량
# 13. 지반 특성(지반증폭계수)
# 14. 착공일
# 14. 준공일
# 15. 용도
# 17. 층수,
# 17. 높이
# 18. 구조공법 (RC/SRC 등, 사용된 요소에 따라 자동 세팅)
# 19. 구조형식(벽식, 라멘)
# 20. 순타/역타(Top-down)
# 21.  평면 Shape ( box, triangle, Box(중정) , free, L, Y, 비표준 )
# 23. 기초 형태(파일, 지내력, 매트)


def process_concrete(engine, conc_df, building_name, floor_ids):
    conc_df = conc_df.merge(floor_ids, left_on=["층번호"], right_on=["floor_number"])
    conc_df = conc_df[
        [
            "건물유형",
            "건물분류",
            "건물명",
            "분류",
            "구성",
            "시공존",
            "부재",
            "부재명",
            "분류명",
            "값",
            "객체ID",
            "할증",
            "값(할증)",
            "BOQ코드",
            "BOQ명칭",
            "BOQ규격",
            "BOQ단위",
            "산출식",
            "재질명",
            "굵은골재",
            "Conc_강도",
            "슬럼프",
            "골재-강도-슬럼프",
            "체적",
            "id",  # floor_id
        ]
    ]

    # rename
    conc_df.columns = [
        "building_type",
        "building_category",
        "building_name",
        "category",
        "composition",
        "construction_zone",
        "component_type",
        "section_name",
        "category_name",
        "value",
        "object_id",
        "surcharge",
        "surcharge_value",
        "boq_code",
        "boq_name",
        "boq_spec",
        "boq_unit",
        "calculation_formula",
        "quality_name",
        "coarse_aggregate",
        "concrete_strength",
        "slump",
        "aggregate_strength_concrete_strength_slump",
        "volume",
        "floor_id",
    ]
    conc_df.to_sql("concrete", engine, if_exists="append", index=False)
    print(f"Concrete info of {building_name} is added.")


def process_formwork(engine, formwork_df, building_name, floor_ids):
    formwork_df = formwork_df.merge(
        floor_ids, left_on=["층번호"], right_on=["floor_number"]
    )
    formwork_df = formwork_df[
        [
            "분류",
            "구성",
            "시공존",
            "부재",
            "부재명",
            "분류명",
            "값",
            "객체ID",
            "할증",
            "값(할증)",
            "BOQ코드",
            "BOQ명칭",
            "BOQ규격",
            "BOQ단위",
            "산출식",
            "형틀위치",
            "형틀유형",
            "면적",
            "id",  # floor_id
        ]
    ]

    # rename
    formwork_df.columns = [
        "category",
        "composition",
        "construction_zone",
        "component_type",
        "section_name",
        "category_name",
        "value",
        "object_id",
        "surcharge",
        "surcharge_value",
        "boq_code",
        "boq_name",
        "boq_spec",
        "boq_unit",
        "calculation_formula",
        "formwork_position",
        "formwork_type",
        "area",
        "floor_id",
    ]
    formwork_df.to_sql("formwork", engine, if_exists="append", index=False)
    print(f"Formwork info of {building_name} is added.")


# DataFrame 'rebar_df'
def process_rebar(engine, rebar_df, building_name, floor_ids):
    rebar_df = rebar_df.merge(floor_ids, left_on=["층번호"], right_on=["floor_number"])
    rebar_df = rebar_df[
        [
            "분류",
            "구성",
            "시공존",
            "부재",
            "부재명",
            "분류명",
            "값",
            "객체ID",
            "할증",
            "값(할증)",
            "BOQ코드",
            "BOQ명칭",
            "BOQ규격",
            "BOQ단위",
            "산출식",
            "철근타입",
            "철근강종",
            "철근직경",
            "철근형상개수",
            "철근형상길이",
            "철근단위중량",
            "철근ID",
            "개수",
            "중량",
            "id",  # floor_id
        ]
    ]

    # rename
    rebar_df.columns = [
        "category",
        "composition",
        "construction_zone",
        "component_type",
        "section_name",
        "category_name",
        "value",
        "object_id",
        "surcharge",
        "surcharge_value",
        "boq_code",
        "boq_name",
        "boq_spec",
        "boq_unit",
        "calculation_formula",
        "rebar_type",
        "rebar_grade",
        "rebar_diameter",
        "rebar_shape_count",
        "rebar_shape_length",
        "rebar_unit_weight",
        "rebar_id",
        "rebar_count",
        "rebar_weight",
        "floor_id",
    ]
    rebar_df.to_sql("rebar", engine, if_exists="append", index=False)
    print(f"Rebar info of {building_name} is added.")


def create_tables(connection):
    tables = []

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
                total_area DOUBLE,
                structure_code VARCHAR(255),
                performance_design_target ENUM('Y', 'N'),
                seismic_coefficient FLOAT,
                wind_exposure_cat ENUM('A','B','C','D'),
                wind_tunnel_test ENUM('Y', 'N'),
                rainfall FLOAT,
                ground_characteristics FLOAT,
                construction_start DATE,
                construction_end DATE,
                `usage` VARCHAR(255),
                number_of_floors INT,
                height FLOAT,
                construction_method VARCHAR(255),
                structure_type VARCHAR(255),
                top_down ENUM('Y', 'N'),
                plane_shape VARCHAR(255),                
                foundation_type VARCHAR(255)
            );
        """,
        },
        {
            "table_name": "building",
            "sql_create": """
            CREATE TABLE IF NOT EXISTS building (
                id INT AUTO_INCREMENT PRIMARY KEY,
                building_name VARCHAR(255), /*bhb file name*/
                building_type VARCHAR(255),
                screenshot VARCHAR(255), /*screenshot url*/
                total_area FLOAT, /*pre-calculated from floor areas*/
                stories INT, /*pre-calculated from floors*/
                project_id INT,
                FOREIGN KEY (project_id) REFERENCES project(id)
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
                FOREIGN KEY (building_id) REFERENCES building(id)
            );
        """,
        },
        {
            "table_name": "concrete",
            "sql_create": """
            CREATE TABLE IF NOT EXISTS concrete (
                id INT AUTO_INCREMENT PRIMARY KEY,
                building_type VARCHAR(255),
                building_category VARCHAR(255),
                building_name VARCHAR(255),
                category VARCHAR(255),
                composition VARCHAR(255),
                construction_zone VARCHAR(255),
                component_type VARCHAR(255),
                section_name VARCHAR(255),
                category_name VARCHAR(255),
                value FLOAT,
                object_id INT,
                surcharge FLOAT,
                surcharge_value FLOAT,
                boq_code VARCHAR(255),
                boq_name VARCHAR(255),
                boq_spec VARCHAR(255),
                boq_unit VARCHAR(255),
                calculation_formula VARCHAR(2047),
                quality_name VARCHAR(255),
                coarse_aggregate VARCHAR(8),
                concrete_strength VARCHAR(8),
                slump VARCHAR(8),
                aggregate_strength_concrete_strength_slump VARCHAR(32),
                volume FLOAT,
                floor_id INT,
                FOREIGN KEY (floor_id) REFERENCES floor(id)
            );
        """,
        },
        {
            "table_name": "formwork",
            "sql_create": """
            CREATE TABLE IF NOT EXISTS formwork (
                id INT AUTO_INCREMENT PRIMARY KEY,
                category VARCHAR(255),
                composition VARCHAR(255),
                construction_zone VARCHAR(255),
                component_type VARCHAR(255),
                section_name VARCHAR(255),
                category_name VARCHAR(255),
                value FLOAT,
                object_id INT,
                surcharge FLOAT,
                surcharge_value FLOAT,
                boq_code VARCHAR(255),
                boq_name VARCHAR(255),
                boq_spec VARCHAR(255),
                boq_unit VARCHAR(255),
                calculation_formula VARCHAR(2047),
                formwork_position VARCHAR(255),
                formwork_type VARCHAR(255),
                area FLOAT,
                floor_id INT,
                FOREIGN KEY (floor_id) REFERENCES floor(id)
            );
        """,
        },
        {
            "table_name": "rebar",
            "sql_create": """
            CREATE TABLE IF NOT EXISTS rebar (
                id INT AUTO_INCREMENT PRIMARY KEY,
                category VARCHAR(255),
                composition VARCHAR(255),
                construction_zone VARCHAR(255),
                component_type VARCHAR(255),
                section_name VARCHAR(255),
                category_name VARCHAR(255),
                value FLOAT,
                object_id INT,
                surcharge FLOAT,
                surcharge_value FLOAT,
                boq_code VARCHAR(255),
                boq_name VARCHAR(255),
                boq_spec VARCHAR(255),
                boq_unit VARCHAR(255),
                calculation_formula VARCHAR(2047),
                rebar_type VARCHAR(255),
                rebar_grade VARCHAR(255),
                rebar_diameter FLOAT,
                rebar_shape_count INT,
                rebar_shape_length FLOAT,
                rebar_unit_weight FLOAT,
                rebar_id INT,
                rebar_count INT,
                rebar_weight FLOAT,
                floor_id INT,
                FOREIGN KEY (floor_id) REFERENCES floor(id)
            );
        """,
        },
    ]

    # 테이블 생성
    for table in tables:
        connection.execute(text(table["sql_create"]))


# MySQL 연결 정보
def connect_to_db():
    db_config = {
        "host": "localhost",
        "port": 3306,
        "user": "root",
        "password": "Magus533!!",
        "database": "structure",
    }

    db_url = f"mysql+pymysql://{db_config['user']}:{db_config['password']}@{db_config['host']}:{db_config['port']}/{db_config['database']}"

    # 데이터베이스가 존재하지 않는 경우, 생성
    if not database_exists(db_url):
        create_database(db_url)

    engine = create_engine(db_url)

    db_name = db_config["database"]

    try:
        connection = engine.connect()
        if connection:
            print(f"Successfully connected to database {db_name}")
        else:
            print("Failed to create connection")
            raise Exception("Failed to create connection")
    except Exception as e:
        print(
            f"An error occurred when trying to connect to database {db_name}: {str(e)}"
        )
        raise e

    return engine, connection


def process_floor(engine, merged_floor_df, building_name, building_id):
    floor_df = merged_floor_df
    floor_df["building_id"] = building_id
    floor_df = floor_df[["층번호", "층이름", "층유형", "층분류", "층고", "층면적", "층둘레", "building_id"]]
    floor_df.columns = [
        "floor_number",
        "floor_name",
        "floor_type",
        "floor_category",
        "floor_height",
        "floor_area",
        "floor_perimeter",
        "building_id",
    ]
    floor_df.to_sql("floor", engine, if_exists="append", index=False)

    print(f"Floors info of {building_name} is added.")

    floor_ids = pd.read_sql(
        f"SELECT * FROM floor WHERE building_id = {building_id}", engine
    )

    return floor_ids


# project 테이블에 프로젝트 이름 삽입
def process_project(engine, unique_projects):
    project_df = pd.DataFrame(unique_projects, columns=["project_name"])
    project_name = project_df["project_name"][0]  # 하나만 있다고 가정. 하나 이상 있으면 입력 오류

    existing_project = pd.read_sql(
        f"SELECT * FROM project WHERE project_name = '{project_name}'", engine
    )

    if existing_project.empty:
        # 중복 프로젝트가 없으면 데이터를 삽입합니다.
        project_df.to_sql("project", engine, if_exists="append", index=False)
        print(f"Project {project_name} added.")
    else:
        print(f"Project {project_name} already exists in the database. skipping...")

    # project 테이블에서 공사명과 프로젝트 ID 가져오기
    project_ids = pd.read_sql(
        f'SELECT id, project_name FROM project WHERE project_name = "{project_name}" ',
        engine,
    )  # id, name
    project_id = project_ids["id"][0]
    return project_name, project_id


def process_building(engine, unique_building_df, floor_df, project_id, project_name):
    building_df = floor_df[["공사명", "빌딩명"]].drop_duplicates()
    building_df["project_id"] = project_id
    building_df = building_df.merge(unique_building_df, on="빌딩명", how="outer")
    building_df = building_df.rename(
        columns={"빌딩명": "building_name", "id": "project_id", "분류": "building_type"}
    )
    building_df = building_df[["building_name", "building_type", "project_id"]]
    building_name = building_df["building_name"][0]  # 하나만 있어야 한다.

    existing_building = pd.read_sql(
        f'SELECT * FROM building WHERE building_name = "{building_name}" AND project_id = {project_id}',
        engine,
    )

    if existing_building.empty:
        # 중복 빌딩이 없으면 데이터를 삽입합니다.
        building_df.to_sql("building", engine, if_exists="append", index=False)
        print(
            f"Building {building_name} is added under the Project {project_name}. Proceeding..."
        )
    else:
        print(
            f"Building {building_name} under the Project {project_name} already exists in the database. skipping all sub data, and end"
        )
        raise Exception("already existing building")

    building_ids = pd.read_sql(
        f'SELECT * FROM building WHERE project_id = {project_id} AND building_name = "{building_name}"',
        engine,
    )
    building_id = building_ids["id"][0]  # 하나만 남아야 한다.

    return building_name, building_id


def update_bhCSV_from_path(engine):
    conc_df = pd.read_csv(
        "conc.csv"
    )  # , header=None, names=["빌딩명", "분류", "구성", "건물유형", "건물분류", "건물명", "층유형", "층분류", "층번호", "층이름", "시공존", "부재", "부재명", "분류명", "값", "객체ID", "할증", "값(할증)", "BOQ코드", "BOQ명칭", "BOQ규격", "BOQ단위", "산출식", "재질명", "굵은골재", "Conc_강도", "슬럼프", "골재-강도-슬럼프", "체적"])
    formwork_df = pd.read_csv(
        "formwork.csv"
    )  # , header=None, names=["빌딩명", "분류", "구성", "건물유형", "건물분류", "건물명", "층유형", "층분류", "층번호", "층이름", "시공존", "부재", "부재명", "분류명", "값", "객체ID", "할증", "값(할증)", "BOQ코드", "BOQ명칭", "BOQ규격", "BOQ단위", "산출식", "형틀위치", "형틀유형", "면적"])
    rebar_df = pd.read_csv(
        "rebar.csv"
    )  # , header=None, names=["빌딩명", "분류", "구성", "건물유형", "건물분류", "건물명", "층유형", "층분류", "층번호", "층이름", "시공존", "부재", "부재명", "분류명", "값", "객체ID", "할증", "값(할증)", "BOQ코드", "BOQ명칭", "BOQ규격", "BOQ단위", "산출식", "철근타입", "철근강종", "철근직경", "철근형상개수", "철근형상길이", "철근단위중량", "철근ID", "개수", "중량"])

    # floor CSV 파일 읽기
    floor_df = pd.read_csv(
        "floor.csv"
    )  # , header=None, names=["공사명", "빌딩명", "층번호", "층이름", "층면적", "층둘레"])

    unique_floor_df = conc_df[
        ["층유형", "층분류", "층번호"]
    ].drop_duplicates()  # 사용안된 층은 conc에 없으므로 unique_floor에서 빠진다.

    # CSV 파일에서 고유한 프로젝트 및 빌딩 이름 가져오기
    unique_projects = floor_df["공사명"].unique()
    # unique_buildings = floor_df['빌딩명'].unique()
    unique_building_df = conc_df[["빌딩명", "분류"]].drop_duplicates()  #'구성'?
    merged_floor_df = pd.merge(floor_df, unique_floor_df, on="층번호")

    try:
        project_name, project_id = process_project(engine, unique_projects)
        building_name, building_id = process_building(
            engine, unique_building_df, floor_df, project_id, project_name
        )
        floor_ids = process_floor(engine, merged_floor_df, building_name, building_id)

        process_concrete(engine, conc_df, building_name, floor_ids)
        process_formwork(engine, formwork_df, building_name, floor_ids)
        process_rebar(engine, rebar_df, building_name, floor_ids)
    except Exception as e:
        print(f"An error occurred when trying to update database: {str(e)}")


def traverse_and_process_csv(path, engine):
    for root, dirs, files in os.walk(path):
        for directory in dirs:
            directory_path = os.path.join(root, directory)
            os.chdir(directory_path)
            print("Processing directory: ", path)

            update_bhCSV_from_path(directory_path, engine)


# 시작할 최상위 디렉토리 경로를 넣으십시오.


def main():
    engine, connection = connect_to_db()
    create_tables(connection)
    root_path = os.getcwd() + "\\csv data"

    traverse_and_process_csv(root_path, engine)


if __name__ == "__main__":
    main()
