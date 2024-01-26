from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
import pandas as pd

import json
from loggingHandler import add_log

from sqlalchemy import text

from .user_router import verify_user, TokenData
from exceptionHandler import exception_handler
from ..crud.project_crud import *

from ..database import Database

router = APIRouter()

# 프로젝트 내부에 있는 attribute 값들을 .json파일로 보내기
# 여러개의 .json을 보낼때는 "," 로 연결해주면 됨. ex) id,total_area, ...
# @router.get("/project/{project_attribute}")
# @exception_handler
# async def get_project_attribute(project_attribute: str, token: TokenData = Depends(verify_user)):
#     valid_check_query = """
#         SELECT COLUMN_NAME
#         FROM INFORMATION_SCHEMA.COLUMNS
#         WHERE TABLE_NAME = 'project' AND TABLE_SCHEMA = 'structure3'
#     """
#     valid_attributes = pd.read_sql(valid_check_query, engine)['COLUMN_NAME'].tolist() # 테이블에 존재하는 attribute 목록
#     project_attributes = project_attribute.split(',')  # 여러개의 attribute를 요청했을때 ","로 구분할 수 있게 split하기

#     # invalid_attributes 리스트에 유효하지 않은 attribute들을 저장
#     invalid_attributes = [attr for attr in project_attributes if attr not in valid_attributes]

#     # 유효하지 않은 attribute를 요청받았을 시, 오류 메시지 보내기
#     if invalid_attributes:
#         error_message = {"error": f"Invalid attribute(s): {', '.join(invalid_attributes)}"}
#         return JSONResponse(error_message)

#     attribute_list = ', '.join(project_attributes) # 하나의 string으로 합치기(query문에 넣어야 하기 때문)
#     query = f"""
#         SELECT {attribute_list}
#         FROM structure3.project
#         ORDER BY project.id
#     """
#     project_attribute_df = pd.read_sql(query, engine)
#     return JSONResponse(project_attribute_df.to_json(force_ascii=False, orient="records"))

# table에 있는 데이터 전부 보내기
@router.get("/{table_name}")
@exception_handler
async def get_project(table_name: str, token: TokenData = Depends(verify_user)):
    valid_check_query = """
        SELECT TABLE_NAME
        FROM information_schema.tables
        WHERE table_schema = 'structure3'
    """
    valid_attributes = pd.read_sql(valid_check_query, engine)[
        "TABLE_NAME"
    ].tolist()  # DB안에 있는 table 목록
    project_attributes = table_name.split(
        ","
    )  # 여러개의 table을 요청했을때 ","로 구분할 수 있게 split하기

    # invalid_attributes 리스트에 유효하지 않은 attribute들을 저장
    invalid_attributes = [
        attr for attr in project_attributes if attr not in valid_attributes
    ]

    # 유효하지 않은 attribute를 요청받았을 시, 오류 메시지 보내기
    if invalid_attributes:
        error_message = {
            "error": f"Invalid attribute(s): {', '.join(invalid_attributes)}"
        }
        return JSONResponse(error_message)

    attribute_list = ", ".join(
        project_attributes
    )  # 하나의 string으로 합치기(query문에 넣어야 하기 때문)

    table_name = attribute_list

    query = f"""
        SELECT * FROM {table_name};
    """

    table_df = pd.read_sql(query, engine)
    return JSONResponse(table_df.to_json(force_ascii=False, orient="records"))


# table들의 수 상수값으로 리턴
@router.get("/{table_name}/count")
@exception_handler
async def get_total_project_num(table_name: str, token: TokenData = Depends(verify_user)):
    query = text(f"SELECT COUNT(*) FROM structure3.{table_name}")

    with engine.connect() as connection:
        result = connection.execute(query)
        table_count = result.scalar()

    return {table_count}


@router.get("/project/{project_id}/project_detail")
@exception_handler
async def get_project_detail_data(project_id: int, token: TokenData = Depends(verify_user), db=Depends(Database().get_db)):
    # query = f"""
    #     SELECT p.project_name, p.building_area, p.construction_company, 
    #     p.location, p.total_area, p.construction_start, p.construction_end,
    #     (p.construction_end-p.construction_start) AS total_date,
    #     COUNT(*) AS building_count
    #     FROM structure3.project AS p
    #     JOIN structure3.building AS b ON p.id = b.project_id
    #     WHERE p.id = {project_id};
    # """

    # project_detail_df = pd.read_sql(query, engine)

    project_detail_df = get_project_detail_df(db, project_id)
    return JSONResponse(project_detail_df.to_json(force_ascii=False, orient="records"))

@router.get("/project/{project_id}/building_detail")
@exception_handler
async def get_building_details_by_project_id(project_id: int, token: TokenData = Depends(verify_user)):
    query=f"""
        SELECT building.* 
        FROM project
        JOIN building ON project.id = building.project_id
        WHERE project.id = {project_id}
    """
    building_detail_df = pd.read_sql(query, engine)
    print(building_detail_df)
    return JSONResponse(building_detail_df.to_json(force_ascii=False, orient="records"))


# 프로젝트 용도별 비율
@router.get("/project/usage_ratio")
@exception_handler
async def get_project_usage_ratio(token: TokenData = Depends(verify_user)):
    query = """
        SELECT structure3.project.usage as field, COUNT(*) as count, 
        COUNT(*) * 100.0 / SUM(COUNT(*)) OVER() AS percentage
        FROM structure3.project 
        GROUP BY structure3.project.usage
        ORDER BY percentage DESC;
    """
    project_usage_df = pd.read_sql(query, engine)
    return JSONResponse(project_usage_df.to_json(force_ascii=False, orient="records"))


# testing
# 프로젝트 건설회사별 비율
@router.get("/project/construction_company_ratio")
@exception_handler
async def get_project_construction_company_ratio(token: TokenData = Depends(verify_user)):
    
    query = """
        SELECT structure3.project.construction_company as field, COUNT(*) as count,
        COUNT(*) * 100.0 / SUM(COUNT(*)) OVER() AS percentage 
        FROM structure3.project 
        GROUP BY structure3.project.construction_company
        ORDER BY percentage DESC;
    """
    project_construction_company_df = pd.read_sql(query, engine)

    return JSONResponse(
        project_construction_company_df.to_json(force_ascii=False, orient="records")
    )



# 프로젝트 지역지구별 비율
@router.get("/project/location_ratio")
@exception_handler
async def get_project_location_ratio(token: TokenData = Depends(verify_user)):
    query = """
        SELECT structure3.project.location as field, COUNT(*) as count,
        COUNT(*) * 100.0 / SUM(COUNT(*)) OVER() AS percentage
        FROM structure3.project 
        GROUP BY structure3.project.location
        ORDER BY percentage DESC;
    """
    project_location_df = pd.read_sql(query, engine)
    return JSONResponse(
        project_location_df.to_json(force_ascii=False, orient="records")
    )


# construction_company당 면적
@router.get("/project/construction_company_total_area")
@exception_handler
async def get_construction_company_total_area(token: TokenData = Depends(verify_user)):
    query = """
        SELECT construction_company, SUM(total_area) AS total_area_sum
        FROM structure3.project
        GROUP BY construction_company
        ORDER BY total_area_sum
    """

    construction_company_total_area_df = pd.read_sql(query, engine)
    return JSONResponse(
        construction_company_total_area_df.to_json(force_ascii=False, orient="records")
    )


# map 그릴때 필요한 데이터(좌표)들 보내기
@router.get("/project/map")
@exception_handler
async def get_map_data(token: TokenData = Depends(verify_user)):
    query = """
        SELECT sub_table.latitude, sub_table.longitude, SUM(count) AS sum 
        FROM 
            (SELECT latitude, longitude, COUNT(*) AS count 
            FROM structure3.location_coordinate AS loc 
            JOIN structure3.building AS bldg ON loc.project_id = bldg.project_id
            GROUP BY loc.project_id) AS sub_table
        GROUP BY sub_table.latitude, sub_table.longitude;
    """
    map_coordinates_df = pd.read_sql(query, engine)
    map_coordinates_json = json.loads(map_coordinates_df.to_json())

    coordinates = []
    for i in range(0, len(map_coordinates_json["latitude"])):
        lat = map_coordinates_json["latitude"][str(i)]
        lon = map_coordinates_json["longitude"][str(i)]
        count = map_coordinates_json["sum"][str(i)]
        coordinates.append({"latlng": [lat, lon], "sum": count})

    return coordinates


# project의 total_area 히스토그램
@router.get("/project/total_area_histogram")
@exception_handler
async def get_total_area_histogram(token: TokenData = Depends(verify_user)):
    query = """
        SELECT 
            subquery.min_val as min_val,
            subquery.max_val AS max_val,
            FLOOR((p.total_area - subquery.min_val) / subquery.interval_size) AS range_num,
            COUNT(*) AS item_count
        FROM
            (SELECT 
                MAX(total_area) AS max_val,
                MIN(total_area) AS min_val,
                (MAX(total_area) - MIN(total_area)) / 8 AS interval_size
            FROM
                structure3.project) AS subquery
        JOIN structure3.project AS p ON p.total_area >= subquery.min_val AND p.total_area <= subquery.max_val
        GROUP BY subquery.min_val, subquery.max_val, range_num
        ORDER BY range_num;
    """
    map_table_df = pd.read_sql(query, engine)
    return JSONResponse(map_table_df.to_json(force_ascii=False, orient="records"))