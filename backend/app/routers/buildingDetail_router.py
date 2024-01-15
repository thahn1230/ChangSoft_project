from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
import pandas as pd
import json
from loggingHandler import add_log

from sqlalchemy import text

from ..database import create_db_connection
from .user_router import verify_user, TokenData
from exceptionHandler import exception_handler

router = APIRouter()
engine = create_db_connection()


# 특정 building_id의 building의 데이터를 보내기
@router.get("/building/{building_id}/get_project_name")
@exception_handler
async def get_project_building_data(building_id: int, token: TokenData = Depends(verify_user)):
    print(token)
    query = f"""
        SELECT project.project_name, building.building_name 
        FROM project JOIN building 
        ON project.id = building.project_id 
        WHERE building.id = {building_id}
    """

    project_building_df = pd.read_sql(query, engine)
    return JSONResponse(
        project_building_df.to_json(force_ascii=False, orient="records")
    )


# building_detail 나타낼때 필요한 데이터들 전부 보내기
@router.get("/building/additional_sub_info")
@exception_handler
async def get_sub_building_names_data(token: TokenData = Depends(verify_user)):
    query = """
        SELECT building.*, 
        ((total_area) / 1000000) AS total_area_square_meter,
        (stories_above + stories_below) AS total_stories, 
        ((height_above + height_below)/ 1000) AS total_height,
        CONCAT(stories_above, ' / ', stories_below) AS stories_above_below,
        (height_above / 1000) AS height_above_meter,
        (height_below / 1000) AS height_below_meter,
        CONCAT(FORMAT(ROUND(height_above / 1000, 2), 2), ' / ', 
        FORMAT(ROUND(height_below / 1000, 2), 2)) AS height_above_below,
        GROUP_CONCAT(sub_building.sub_building_name SEPARATOR ', ') AS sub_bldg_list
        FROM building 
        JOIN sub_building ON building.id = sub_building.building_id
        GROUP BY building.id
    """

    sub_building_name_df = pd.read_sql(query, engine)
    return JSONResponse(
        sub_building_name_df.to_json(force_ascii=False, orient="records")
    )

# building의 floor_count 히스토그램
@router.get("/building/floor_count_histogram")
@exception_handler
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
