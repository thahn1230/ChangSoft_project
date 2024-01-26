from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
import pandas as pd
import plotly.graph_objects as go
import json
import plotly
from loggingHandler import add_log

from sqlalchemy import text

from ..database import create_db_connection
from .user_router import TokenData, verify_user
from exceptionHandler import exception_handler

from ..database import Database
from ..crud.subBuilding_crud import *

router = APIRouter()

# 빌딩 id의 맞는 sub building을 받기
@router.get("/sub_building/{building_id}")
@exception_handler
async def get_sub_building_data(building_id: int, token: TokenData = Depends(verify_user)):
    sub_building_df = get_subBuilding_df(building_id)

    return JSONResponse(sub_building_df.to_json(force_ascii=False, orient="records"))


### 총괄분석표 ###
# 총괄분석표 전체 sub_building 1
@router.get("/sub_building/total_analysis_table_all/1/{building_id}")
@exception_handler
async def get_total_analysis_data1(building_id: int, token: TokenData = Depends(verify_user)):
    total_analysis_data_df = get_all_subBuilding_analysis1_df(building_id)
    return JSONResponse(
        total_analysis_data_df.to_json(force_ascii=False, orient="records")
    )


# 총괄분석표 전체 sub_building 2
@router.get("/sub_building/total_analysis_table_all/2/{building_id}")
@exception_handler
async def get_total_analysis_data2(building_id: int, token: TokenData = Depends(verify_user)):
    total_analysis_data_df = get_all_subBuilding_analysis2_df(building_id)
    return JSONResponse(
        total_analysis_data_df.to_json(force_ascii=False, orient="records")
    )


# 총괄분석표 한개의 sub_building 1
@router.get("/sub_building/total_analysis_table/1/{sub_building_id}")
@exception_handler
async def get_total_analysis_data3(sub_building_id: int, token: TokenData = Depends(verify_user)):
    analysis_data_df = get_single_subBuilding_analysis1_df
    return JSONResponse(analysis_data_df.to_json(force_ascii=False, orient="records"))


# 총괄분석표 한개의 sub_building 2
@router.get("/sub_building/total_analysis_table/2/{sub_building_id}")
@exception_handler
async def get_total_analysis_data4(sub_building_id: int, token: TokenData = Depends(verify_user)):
    analysis_data_df = get_single_subBuilding_analysis2_df(sub_building_id)
    
    return JSONResponse(analysis_data_df.to_json(force_ascii=False, orient="records"))


### 분석표 ###
# 분석표 전체 sub_building
@router.get("/sub_building/analysis_table_all/{building_id}/concrete")
@exception_handler
async def get_pivot_analysis_concrete_data1(building_id: int, token: TokenData = Depends(verify_user)):
    concrete_analysis_data_pivot_df = get_all_subbuilding_concrete_pivot(building_id)

    return JSONResponse(
        concrete_analysis_data_pivot_df.to_json(force_ascii=False, orient="index")
    )


# 분석표 전체 sub_building에서 formwork 데이터 보이기
@router.get("/sub_building/analysis_table_all/{building_id}/formwork")
@exception_handler
async def get_pivot_analysis_formwork_data1(building_id: int, token: TokenData = Depends(verify_user)):
    formwork_analysis_data_pivot_df = get_all_subbuilding_formwork_pivot(building_id)

    return JSONResponse(
        formwork_analysis_data_pivot_df.to_json(force_ascii=False, orient="index")
    )
    

# 분석표 전체 sub_building에서 rebar 데이터 보이기
@router.get("/sub_building/analysis_table_all/{building_id}/rebar")
@exception_handler
async def get_analysis_rebar_data1(building_id: int, token: TokenData = Depends(verify_user)):
    rebar_analysis_data_df = get_all_subbuilding_rebar_df(building_id)
    
    return JSONResponse(
        rebar_analysis_data_df.to_json(force_ascii=False, orient="records")
    )


# 분석표 sub_building 1개
@router.get("/sub_building/analysis_table/{sub_building_id}/concrete")
@exception_handler
async def get_pivot_analysis_concrete_data2(sub_building_id: int, token: TokenData = Depends(verify_user)):
    concrete_analysis_data_pivot_df = get_single_subbuilding_concrete_pivot(sub_building_id)

    return JSONResponse(
        concrete_analysis_data_pivot_df.to_json(force_ascii=False, orient="index")
    )


# 분석표 sub_building 1개에서 formwork 데이터 보이기
@router.get("/sub_building/analysis_table/{sub_building_id}/formwork")
@exception_handler
async def get_pivot_analysis_formwork_data2(sub_building_id: int, token: TokenData = Depends(verify_user)):
    formwork_analysis_data_pivot_df = get_single_subbuilding_formwork_pivot(sub_building_id)
    return JSONResponse(
        formwork_analysis_data_pivot_df.to_json(force_ascii=False, orient="index")
    )


# 분석표 sub_building 1개에서 rebar 데이터 보이기
@router.get("/sub_building/analysis_table/{sub_building_id}/rebar")
@exception_handler
async def get_analysis_rebar_data2(sub_building_id: int, token: TokenData = Depends(verify_user)):
    rebar_analysis_data_df = get_single_subbuilding_rebar_df(sub_building_id)
    return JSONResponse(
        rebar_analysis_data_df.to_json(force_ascii=False, orient="records")
    )


@router.get("/sub_building/analysis_table/{sub_building_id}/concrete/table")
@exception_handler
async def draw_analysis_concrete2(sub_building_id: int, token: TokenData = Depends(verify_user)):
    # 이거 재사용함
    concrete_analysis_data_pivot_df = get_single_subbuilding_concrete_pivot(sub_building_id)

    fig = go.Figure(data=[
    go.Bar(name=material, x=concrete_analysis_data_pivot_df.index, y=concrete_analysis_data_pivot_df[material])
    for material in concrete_analysis_data_pivot_df.columns
    ])
    fig.update_layout(
    barmode='stack',
    xaxis={'categoryorder':'total descending'},
    width=700  # setting the width to 700
    )
    
    figures_json = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)
    
    return figures_json

## 층별총집계표
# 부재별층잡계표
# 빌딩 안에 어떠한 component_type이 있는지 알려주는 함수
@router.get("/sub_building/floor_analysis_table/{building_id}/component_type")
@exception_handler
async def get_floor_analysis_component_type_data(building_id: int, token: TokenData = Depends(verify_user)):
    component_type_data = get_building_component_type(building_id)

    return JSONResponse(
        component_type_data.to_json(force_ascii=False, orient="records")
    )

# 콘크리트
@router.get("/sub_building/floor_analysis_table/{building_id}/concrete/filter")
@exception_handler
async def get_floor_analysis_concrete_filtered(building_id: int, component_types: str, token: TokenData = Depends(verify_user)):
    component_types = json.loads(component_types)
    component_types=', '.join(f'"{x}"' for x in component_types)
    if component_types == "":
        return []
    
    # query = f"""
    #     SELECT floor_name, material_name, floor_number,
    #     SUM(concrete.volume) AS total_volume FROM concrete
    #     JOIN component ON concrete.component_id = component.id
    #     JOIN floor ON component.floor_id = floor.id
    #     JOIN building ON floor.building_id = building.id
    #     WHERE building.id = {building_id}
    #     AND component.component_type IN ({component_types})
    #     GROUP BY floor_name, concrete.material_name, floor_number
    #     ORDER BY floor_number DESC
    # """

    # concrete_floor_analysis_data_df = pd.read_sql(query, engine)
    # concrete_floor_analysis_data_pivot_df = concrete_floor_analysis_data_df.pivot_table(
    #     index="floor_name",
    #     columns="material_name",
    #     values="total_volume",
    #     sort=False,
    # )

    concrete_floor_analysis_data_pivot_df = get_building_concrete_pivot(building_id, component_types)

    return JSONResponse(
        concrete_floor_analysis_data_pivot_df.to_json(force_ascii=False, orient="index")
    )
    
# 거푸집
@router.get("/sub_building/floor_analysis_table/{building_id}/formwork/filter")
@exception_handler
async def get_floor_analysis_formwork_filtered(building_id: int, component_types: str, token: TokenData = Depends(verify_user)):
    component_types = json.loads(component_types)
    component_types=', '.join(f'"{x}"' for x in component_types)
    if component_types == "":
        return []
    
    formwork_floor_analysis_data_pivot_df = get_building_formwork_pivot(building_id, component_types)
    return JSONResponse(
        formwork_floor_analysis_data_pivot_df.to_json(force_ascii=False, orient="index")
    )
    
# 철근
@router.get("/sub_building/floor_analysis_table/{building_id}/rebar/filter")
@exception_handler
async def get_floor_analysis_rebar_filtered(building_id: int, component_types: str, token: TokenData = Depends(verify_user)):
    component_types = json.loads(component_types)
    component_types=', '.join(f'"{x}"' for x in component_types)

    rebar_floor_analysis_data_df = get_building_rebar_df(building_id, component_types)
    return JSONResponse(
        rebar_floor_analysis_data_df.to_json(force_ascii=False, orient="records")
    )
    
    
    
# 부재별로 타입 보이기
@router.get("/sub_building/quantity_detail/get_quantity_list/{building_id}")
@exception_handler
async def get_quantity_list(building_id: int, token: TokenData = Depends(verify_user)):
    sub_building_df = get_subbuilding_id_name_info(building_id)
    floor_df = get_subbuilding_floor_info(building_id)
    component_df = get_subbuilding_component_info(building_id)
    
    
    return JSONResponse( 
        {"subBuildingInfo": sub_building_df.to_json(force_ascii=False, orient="records"),
        "floorInfo": floor_df.to_json(force_ascii=False, orient="records"),
        "componentInfo": component_df.to_json(force_ascii=False, orient="records"),
        } 
    )
    
# 피봇 그리드
@router.post("/sub_building/component_info")
@exception_handler
async def get_component_info(params: dict, token: TokenData = Depends(verify_user)):
    sub_building_list = params["info"]["subBuildingList"]
    floor_list = params["info"]["floorList"]
    component_list = params["info"]["componentTypeList"]
    conformreb = params["info"]["type"]
    
    sub_building_ids = str([item["id"] for item in sub_building_list])
    sub_building_ids = "("+  sub_building_ids[1:len(sub_building_ids) - 1] +")"
    
    floor_ids = str([item["id"] for item in floor_list])
    floor_ids = "("+  floor_ids[1:len(floor_ids) - 1] +")"
    
    component_names = str([item["componentType"] for item in component_list])
    component_names = "("+  component_names[1:len(component_names) - 1] +")"
    
    data_df = get_component_info_df(conformreb, sub_building_ids, floor_ids, component_names)
    return JSONResponse(data_df.to_json(force_ascii=False, orient="records"))
