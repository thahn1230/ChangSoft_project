from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
import pandas as pd

import json
from loggingHandler import add_log

from .user_router import verify_user, TokenData
from app.schemas.project.response import *
from exceptionHandler import exception_handler
from ..crud.project_crud import *

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
    valid_attributes = get_table_list()
    project_attributes = table_name.split(",")  # 여러개의 table을 요청했을때 ","로 구분할 수 있게 split하기

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
    table_df = get_table_attributes(table_name)
    
    return JSONResponse(table_df.to_json(force_ascii=False, orient="records"))


# table들의 수 상수값으로 리턴
@router.get("/{table_name}/count")
@exception_handler
async def get_total_project_num(table_name: str, token: TokenData = Depends(verify_user)) -> TableCountResponse:
    table_count = get_table_count(table_name)

    return TableCountResponse(
        table_count = table_count
        )


# 프로젝트 정보(이름, 건물면적, 건설회사, 위치, 총면적, 건축기간, 건물 갯수)
@router.get("/project/{project_id}/project_detail")
@exception_handler
async def get_project_detail_data(project_id: int, token: TokenData = Depends(verify_user)) -> ProjectDetailResponse:
    project_detail_df = get_project_detail_df(project_id)
    return ProjectDetailResponse(
        **project_detail_df.to_dict('records')[0]
    )


# # 빌딩 정보(전부 다)
# @router.get("/project/{project_id}/building_detail")
# @exception_handler
# async def get_building_details_by_project_id(project_id: int, token: TokenData = Depends(verify_user)):
#     building_detail_df = get_building_df(project_id)
#     return JSONResponse(building_detail_df.to_json(force_ascii=False, orient="records"))


# 프로젝트 용도별 비율
@router.get("/project/usage_ratio")
@exception_handler
async def get_project_usage_ratio(token: TokenData = Depends(verify_user)) -> FieldRatioResponse:
    project_usage_df = get_project_usage_df()
    return FieldRatioResponse(
        data = project_usage_df.to_dict('records')
    )


# 프로젝트 건설회사별 비율
@router.get("/project/construction_company_ratio")
@exception_handler
async def get_project_construction_company_ratio(token: TokenData = Depends(verify_user)) -> FieldRatioResponse:
    project_construction_company_df = get_project_construction_company_df()
    return FieldRatioResponse(
        data = project_construction_company_df.to_dict('records')
    )


# 프로젝트 지역지구별 비율
@router.get("/project/location_ratio")
@exception_handler
async def get_project_location_ratio(token: TokenData = Depends(verify_user)) -> FieldRatioResponse:
    project_location_df = get_project_location_df()
    return FieldRatioResponse(
        data = project_location_df.to_dict('records')
    )


# construction_company당 면적
@router.get("/project/construction_company_total_area")
@exception_handler
async def get_construction_company_total_area(token: TokenData = Depends(verify_user)):
    construction_company_total_area_df = get_construction_company_total_area_df()
    return JSONResponse(
        construction_company_total_area_df.to_json(force_ascii=False, orient="records")
    )


# map 그릴때 필요한 데이터(좌표)들 보내기
@router.get("/project/map")
@exception_handler
async def get_map_data(token: TokenData = Depends(verify_user)) -> ProjectMapResponse:
    map_coordinates_df = get_map_coordinates_df()
    map_coordinates_json = json.loads(map_coordinates_df.to_json())

    coordinates = []
    for i in range(0, len(map_coordinates_json["latitude"])):
        lat = map_coordinates_json["latitude"][str(i)]
        lon = map_coordinates_json["longitude"][str(i)]
        count = map_coordinates_json["sum"][str(i)]
        # LatLngWithSum 인스턴스 생성
        coordinates.append(LatLngWithSum(latlng=[lat, lon], sum=count))

    return ProjectMapResponse(
        map_data = coordinates
    )


# project의 total_area 히스토그램
@router.get("/project/total_area_histogram")
@exception_handler
async def get_total_area_histogram(token: TokenData = Depends(verify_user)) -> TotalAreaHistogramResponse:
    map_table_df = get_map_table_df()
    return TotalAreaHistogramResponse(
        data = map_table_df.to_dict('records')
    )