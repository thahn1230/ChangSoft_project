from fastapi import APIRouter
from fastapi.responses import JSONResponse
import pandas as pd

from dbAccess import create_db_connection

router = APIRouter()
engine = create_db_connection()


@router.get("/project/{project_id}/building/{building_id}")
def get_project_building_data(project_id: int, building_id: int):
    query=f"""
        SELECT * FROM project JOIN building
        WHERE project.id = building.project_id 
        AND project.id = {project_id} AND building.id = {building_id}
    """
    
    project_building_df = pd.read_sql(query, engine)
    return JSONResponse(project_building_df.to_json(force_ascii=False, orient="records"))