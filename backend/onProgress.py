from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
import pandas as pd

from sqlalchemy.orm import Session
from sqlalchemy import text
from dbAccess import engine
from user import TokenData, verify_user
from exceptionHandler import exception_handler

router = APIRouter()

###########################이 밑부분 코드는 개발중###############################
@router.get("/project/{project_num}/building")
@exception_handler
async def get_building_dataframe(project_num: int, token: TokenData = Depends(verify_user)):
    query = f"""
        SELECT *
        FROM structure3.project AS p
        JOIN structure3.building AS b ON p.id = b.project_id
        WHERE p.id = {project_num};
    """
    building_df = pd.read_sql(query, engine)
    return JSONResponse(building_df.to_json(force_ascii=False, orient = "records"))


@router.get("/data/building_totalnum")
@exception_handler
async def get_building_totalNum_dataframe(token: TokenData = Depends(verify_user)):
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
        pd.DataFrame()
        building_df = pd.DataFrame(building_num.fetchall(), columns=building_column)
        return JSONResponse(building_df.to_json(force_ascii=False, orient="records"))



@router.get("/data/concrete/value")
@exception_handler
async def get_concrete_value_data(min: float, max: float, token: TokenData = Depends(verify_user)):
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


# 프로젝트 내부에 있는 attribute 값들을 .json파일로 보내기
# 여러개의 .json을 보낼때는 "," 로 연결해주면 됨. ex) id,total_area, ...
@router.get("/building/{building_attribute}")
@exception_handler
async def get_building_attribute(building_attribute: str, token: TokenData = Depends(verify_user)):
    valid_check_query = """
        SELECT COLUMN_NAME
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_NAME = 'building' AND TABLE_SCHEMA = 'structure2'
    """
    valid_attributes = pd.read_sql(valid_check_query, engine)['COLUMN_NAME'].tolist() # 테이블에 존재하는 attribute 목록
    building_attributes = building_attribute.split(',')  # 여러개의 attribute를 요청했을때 ","로 구분할 수 있게 split하기

    # invalid_attributes 리스트에 유효하지 않은 attribute들을 저장
    invalid_attributes = [attr for attr in building_attributes if attr not in valid_attributes]

    # 유효하지 않은 attribute를 요청받았을 시, 오류 메시지 보내기
    if invalid_attributes:
        error_message = {"error": f"Invalid attribute(s): {', '.join(invalid_attributes)}"}
        return JSONResponse(error_message)

    attribute_list = ', '.join(building_attributes) # 하나의 string으로 합치기(query문에 넣어야 하기 때문)
    query = f"""
        SELECT {attribute_list}
        FROM structure2.building
        ORDER BY building.id
    """
    building_attribute_df = pd.read_sql(query, engine)
    return JSONResponse(building_attribute_df.to_json(force_ascii=False, orient="records"))
