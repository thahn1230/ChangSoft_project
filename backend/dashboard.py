from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
import pandas as pd
import json
import os
from loggingHandler import add_log

from sqlalchemy import text
from dbAccess import create_db_connection
from user import verify_user, TokenData

router = APIRouter()
engine = create_db_connection()

#test
from exceptionHandler import exception_handler

###################
#    DASHBOARD    #
###################

# for testing
@router.get("/add_error")
async def add_error():
    add_log(404, "cy", "test message")
    return {"detail" : "hello world!"}


# table에 있는 데이터 전부 보내기
@router.get("/dashboard/{table_name}")
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
@router.get("/dashboard/{table_name}/count")
async def get_total_project_num(table_name: str, token: TokenData = Depends(verify_user)):
    query = text(f"SELECT COUNT(*) FROM structure3.{table_name}")

    with engine.connect() as connection:
        result = connection.execute(query)
        table_count = result.scalar()

    return {table_count}


# 프로젝트 용도별 비율
@router.get("/dashboard/project/usage_ratio")
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
@router.get("/dashboard/project/construction_company_ratio")
@exception_handler
async def get_project_construction_company_ratio(token: TokenData = Depends(verify_user)):
    
    print("hi")
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
@router.get("/dashboard/project/location_ratio")
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
@router.get("/dashboard/project/construction_company_total_area")
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
@router.get("/dashboard/project/map")
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
@router.get("/dashboard/project/total_area_histogram")
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


# building의 floor_count 히스토그램
@router.get("/dashboard/building/floor_count_histogram")
async def get_floor_count_histogram(token: TokenData = Depends(verify_user)):
    query = """
        SELECT 
            FLOOR((floor_count) / 10) AS range_num,
            COUNT(*) AS item_count
        FROM
            (SELECT building_name, COUNT(*) AS floor_count 
            FROM structure3.floor AS floor 
            JOIN structure3.building AS building ON building.id = floor.building_id
            GROUP BY building_name) AS subquery
        GROUP BY range_num
        ORDER BY range_num;
    """
    floor_count_table_df = pd.read_sql(query, engine)
    return JSONResponse(
        floor_count_table_df.to_json(force_ascii=False, orient="records")
    )