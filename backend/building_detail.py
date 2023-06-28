from fastapi import APIRouter
from fastapi.responses import JSONResponse
import pandas as pd

from dbAccess import create_db_connection

router = APIRouter()
engine = create_db_connection()

# 특정 id의 project에서의 특정 building_id의 building의 데이터를 보내기
@router.get("/project/{project_id}/building/{building_id}")
def get_project_building_data(project_id: int, building_id: int):
    query=f"""
        SELECT * FROM project JOIN building 
        ON project.id = building.project_id 
        WHERE project.id = {project_id} AND building.id = {building_id}
    """
    
    project_building_df = pd.read_sql(query, engine)
    return JSONResponse(project_building_df.to_json(force_ascii=False, orient="records"))


# 특정 id의 project에서의 특정 building_id의 building에서의 특정 sub_building_id의 sub_building의 데이터를 보내기
@router.get("/project/{project_id}/building/{building_id}/sub_building_info")
def get_building_detail_data(project_id: int, building_id: int):
    query=f"""
        SELECT *
        FROM project 
        JOIN building ON project.id = building.project_id 
        JOIN sub_building ON building.id = sub_building.building_id
        WHERE project.id = {project_id} AND building.id = {building_id}
    """
    
    project_building_df = pd.read_sql(query, engine)
    return JSONResponse(project_building_df.to_json(force_ascii=False, orient="records"))

# 특정 id의 project에서의 특정 building_id의 building에서의 특정 sub_building_id의 sub_building의 데이터를 보내기
@router.get("/project/{project_id}/building/{building_id}/building_detail")
def get_building_detail_data(project_id: int, building_id: int):
    query=f"""
        SELECT project.*, building.* , GROUP_CONCAT(sub_building.sub_building_name SEPARATOR ', ')
        FROM project 
        JOIN building ON project.id = building.project_id 
        JOIN sub_building ON building.id = sub_building.building_id
        WHERE project.id = {project_id} AND building.id = {building_id}
        GROUP BY project.id;
    """
    
    project_building_df = pd.read_sql(query, engine)
    return JSONResponse(project_building_df.to_json(force_ascii=False, orient="records"))

