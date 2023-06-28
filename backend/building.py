from fastapi import APIRouter
from fastapi.responses import JSONResponse
import pandas as pd

from dbAccess import create_db_connection

router = APIRouter()
engine = create_db_connection()


# 프로젝트 내부에 있는 attribute 값들을 .json파일로 보내기
# 여러개의 .json을 보낼때는 "," 로 연결해주면 됨. ex) id,total_area, ...
@router.get("/building/{building_attribute}")
def get_building_attribute(building_attribute: str):
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