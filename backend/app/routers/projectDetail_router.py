from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
import pandas as pd

from dbAccess import create_db_connection
from .user_router import TokenData, verify_user
from exceptionHandler import exception_handler

router = APIRouter()
engine = create_db_connection()


@router.get("/project/{project_id}/project_detail")
@exception_handler
async def get_project_detail_data(project_id: int, token: TokenData = Depends(verify_user)):
    query = f"""
        SELECT p.project_name, p.building_area, p.construction_company, 
        p.location, p.total_area, p.construction_start, p.construction_end,
        (p.construction_end-p.construction_start) AS total_date,
        COUNT(*) AS building_count
        FROM structure3.project AS p
        JOIN structure3.building AS b ON p.id = b.project_id
        WHERE p.id = {project_id};
    """

    project_detail_df = pd.read_sql(query, engine)
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
