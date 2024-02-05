from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
import pandas as pd
import json
from loggingHandler import add_log
import numpy as np

from .user_router import verify_user, TokenData
from exceptionHandler import exception_handler
from app.schemas.building.response import *

from ..crud.building_crud import *

router = APIRouter()


# 특정 building_id의 building의 데이터를 보내기
@router.get("/building/{building_id}/get_project_name")
@exception_handler
async def get_project_building_data(building_id: int, token: TokenData = Depends(verify_user)) -> ProjectNameResponse:
    project_building_df = get_project_building_df(building_id)
    
    return ProjectNameResponse(
        **project_building_df.to_dict('records')[0]
    )


# building_detail 나타낼때 필요한 데이터들 전부 보내기
@router.get("/building/additional_sub_info")
@exception_handler
async def get_sub_building_names_data(token: TokenData = Depends(verify_user)) -> AdditionalSubInfoResponse:
    sub_building_names_df = get_sub_building_names_df()

    return AdditionalSubInfoResponse(
        data = sub_building_names_df.to_dict('records')
    )

# building의 floor_count 히스토그램
@router.get("/building/floor_count_histogram")
@exception_handler
async def get_floor_count_histogram(token: TokenData = Depends(verify_user)) -> FloorCountResponse:   
    floor_count_table_df = get_floor_count_table_df()

    return FloorCountResponse(
        data = floor_count_table_df.to_dict('records')
    )
