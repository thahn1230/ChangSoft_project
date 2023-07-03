from fastapi import APIRouter
from fastapi.responses import JSONResponse
from sqlalchemy import text
import pandas as pd

from dbAccess import create_db_connection

router = APIRouter()
engine = create_db_connection()

# 특정 building_id의 building의 데이터를 보내기
@router.get("/building/{building_id}/get_project_name")
def get_project_building_data(building_id: int):
    query=f"""
        SELECT project.project_name, building.building_name 
        FROM project JOIN building 
        ON project.id = building.project_id 
        WHERE building.id = {building_id}
    """
    
    project_building_df = pd.read_sql(query, engine)
    return JSONResponse(project_building_df.to_json(force_ascii=False, orient="records"))


# 특정 building id의 
@router.get("/building/additional_sub_info")
def get_sub_building_names_data():
    query="""
        SELECT building.*, 
        GROUP_CONCAT(sub_building.sub_building_name SEPARATOR ', ') AS sub_bldg_list
        FROM building 
        JOIN sub_building ON building.id = sub_building.building_id
        GROUP BY building.id
    """
    
    sub_building_name_df = pd.read_sql(query, engine)
    return JSONResponse(sub_building_name_df.to_json(force_ascii=False, orient="records"))
