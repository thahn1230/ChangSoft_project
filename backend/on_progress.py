from fastapi import APIRouter
from fastapi.responses import JSONResponse
import pandas as pd

from sqlalchemy.orm import Session
from sqlalchemy import text
from dbAccess import engine

router = APIRouter()

###########################이 밑부분 코드는 개발중###############################
@router.get("/project/{project_num}/building")
def get_building_dataframe(project_num: int):
    query = f"""
        SELECT *
        FROM structure2.project AS p
        JOIN structure2.building AS b ON p.id = b.project_id
        WHERE p.id = {project_num};
    """
    building_df = pd.read_sql(query, engine)
    return JSONResponse(building_df.to_json(force_ascii=False, orient = "records"))


@router.get("/data/building_totalnum")
def get_building_totalNum_dataframe():
    with Session(engine) as session:
        # structure.concrete 전부 다 선택
        building_num = session.execute(
            text(
                """
        SELECT structure.project.id, structure.project.project_name, COUNT(*) as count
        FROM structure.project
        JOIN structure.building ON structure.project.id = structure.building.project_id
        GROUP BY structure.project.id;
        """
            )
        )

        building_column = building_num.keys()

        # 결과를 데이터프레임으로 변환
        building_df = pd.DataFrame(building_num.fetchall(), columns=building_column)
        return JSONResponse(building_df.to_json(force_ascii=False, orient="records"))



@router.get("/data/concrete/value")
def get_concrete_value_data(min: float, max: float):
    with Session(engine) as session:
        # structure.concrete 전부 다 선택
        concrete_value = session.execute(
            text(
                """
            SELECT *
            FROM structure.concrete
            WHERE value BETWEEN :min AND :max
            """
            ),
            {"min": min, "max": max},
        )

        concrete_value_column = concrete_value.keys()
        concrete_value_df = pd.DataFrame(
            concrete_value.fetchall(), columns=concrete_value_column
        )
        return JSONResponse(
            concrete_value_df.to_json(force_ascii=False, orient="records")
        )
