from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
import pandas as pd
import plotly.graph_objects as go
import json
import plotly

from dbAccess import create_db_connection
from user import TokenData, verify_user
from exceptionHandler import exception_handler

router = APIRouter()
engine = create_db_connection()


# 빌딩 id의 맞는 sub building을 받기
@router.get("/sub_building/{building_id}")
@exception_handler
async def get_sub_building_data(building_id: int, token: TokenData = Depends(verify_user)):
    query = f"""
        SELECT * FROM sub_building
        WHERE sub_building.building_id = {building_id}
    """

    sub_building_df = pd.read_sql(query, engine)
    return JSONResponse(sub_building_df.to_json(force_ascii=False, orient="records"))


### 총괄분석표 ###


# 총괄분석표 전체 sub_building 1
@router.get("/sub_building/total_analysis_table_all/1/{building_id}")
@exception_handler
async def get_total_analysis_data1(building_id: int, token: TokenData = Depends(verify_user)):
    query = f"""
        SELECT *,
        total_floor_area_meter, total_floor_area_pyeong,
        (total_concrete / total_floor_area_meter) AS con_floor_area_meter,
        (total_formwork / total_floor_area_meter) AS form_floor_area_meter,
        (total_rebar / total_floor_area_meter) AS reb_floor_area_meter,
        (total_concrete / total_floor_area_pyeong) AS con_floor_area_pyeong,
        (total_formwork / total_floor_area_pyeong) AS form_floor_area_pyeong,
        (total_rebar / total_floor_area_pyeong) AS reb_floor_area_pyeong,
        (total_formwork / total_concrete) AS form_con_result,
        (total_rebar / total_concrete) AS reb_con_result
        FROM (SELECT
        (SELECT SUM(volume) FROM structure3.concrete AS con
        JOIN structure3.component AS com ON com.id = con.component_id
        JOIN structure3.sub_building AS sub ON sub.id = com.sub_building_id
        WHERE sub.building_id = {building_id}) AS total_concrete,
                
        (SELECT SUM(area) FROM structure3.formwork AS form
        JOIN structure3.component AS com ON com.id = form.component_id
        JOIN structure3.sub_building AS sub ON sub.id = com.sub_building_id
        WHERE sub.building_id = {building_id}) AS total_formwork,
                    
        (SELECT SUM(rebar_weight) FROM structure3.rebar AS reb
        JOIN structure3.component AS com ON com.id = reb.component_id
        JOIN structure3.sub_building AS sub ON sub.id = com.sub_building_id
        WHERE sub.building_id = {building_id}) AS total_rebar,

        (SELECT SUM(floor.floor_area / 1000000)
        FROM floor
        JOIN building ON floor.building_id = building.id
        WHERE building.id = {building_id}) AS total_floor_area_meter,
                
        (SELECT SUM((floor.floor_area / 1000000) * 0.3025)
        FROM floor
        JOIN building ON floor.building_id = building.id
        WHERE building.id = {building_id}) AS total_floor_area_pyeong
    ) AS sub_table
    """

    total_analysis_data_df = pd.read_sql(query, engine)
    return JSONResponse(
        total_analysis_data_df.to_json(force_ascii=False, orient="records")
    )


# 총괄분석표 전체 sub_building 2
@router.get("/sub_building/total_analysis_table_all/2/{building_id}")
@exception_handler
async def get_total_analysis_data2(building_id: int, token: TokenData = Depends(verify_user)):
    query = f"""
        SELECT c.component_type,
        SUM(concrete_volume) AS concrete_volume,
        SUM(formwork_area) AS formwork_area,
        SUM(rebar_weight) AS rebar_weight,
        (SUM(concrete_volume) / (SELECT SUM(volume) FROM concrete 
        WHERE component_id 
        IN (SELECT id FROM component WHERE sub_building_id IN 
        (SELECT id FROM sub_building WHERE building_id = {building_id}))) * 100)
        AS concrete_percentage,
        (SUM(formwork_area) / (SELECT SUM(area) FROM formwork WHERE component_id 
        IN (SELECT id FROM component WHERE sub_building_id IN 
        (SELECT id FROM sub_building 
        WHERE building_id = {building_id}))) * 100) 
        AS formwork_percentage,
        (SUM(rebar_weight) / (SELECT SUM(rebar_weight) FROM rebar 
        WHERE component_id 
        IN (SELECT id FROM component WHERE sub_building_id IN 
        (SELECT id FROM sub_building 
        WHERE building_id = {building_id}))) * 100) AS rebar_percentage
        FROM (
            SELECT component.component_type
            FROM component
            GROUP BY component.component_type
        ) AS c
        LEFT JOIN (
            SELECT component.component_type, SUM(concrete.volume) AS concrete_volume
            FROM concrete
            JOIN component ON concrete.component_id = component.id
            JOIN sub_building ON component.sub_building_id = sub_building.id
            WHERE sub_building.building_id = {building_id}
            GROUP BY component.component_type
        ) AS cv ON c.component_type = cv.component_type
        LEFT JOIN (
            SELECT component.component_type, SUM(formwork.area) AS formwork_area
            FROM formwork
            JOIN component ON formwork.component_id = component.id
            JOIN sub_building ON component.sub_building_id = sub_building.id
            WHERE sub_building.building_id = {building_id}
            GROUP BY component.component_type
        ) AS fa ON c.component_type = fa.component_type
        LEFT JOIN (
            SELECT component.component_type, SUM(rebar.rebar_weight) AS rebar_weight
            FROM rebar
            JOIN component ON rebar.component_id = component.id
            JOIN sub_building ON component.sub_building_id = sub_building.id
            WHERE sub_building.building_id = {building_id}
            GROUP BY component.component_type
        ) AS rw ON c.component_type = rw.component_type
        GROUP BY c.component_type
        HAVING concrete_volume IS NOT NULL
            AND formwork_area IS NOT NULL
            AND rebar_weight IS NOT NULL
        ORDER BY c.component_type;
    """

    total_analysis_data_df = pd.read_sql(query, engine)
    return JSONResponse(
        total_analysis_data_df.to_json(force_ascii=False, orient="records")
    )


# 총괄분석표 한개의 sub_building 1
@router.get("/sub_building/total_analysis_table/1/{sub_building_id}")
@exception_handler
async def get_total_analysis_data3(sub_building_id: int, token: TokenData = Depends(verify_user)):
    query = f"""
        SELECT *,
        (total_formwork / total_concrete) AS form_con_result,
        (total_rebar / total_concrete) AS reb_con_result
        FROM (SELECT
                (SELECT SUM(volume) FROM structure3.concrete con
                JOIN structure3.component com ON com.id = con.component_id
                JOIN structure3.sub_building sub ON sub.id = com.sub_building_id
                WHERE sub.id = {sub_building_id}) AS total_concrete,
                
                (SELECT SUM(area) FROM structure3.formwork form
                JOIN structure3.component com ON com.id = form.component_id
                JOIN structure3.sub_building sub ON sub.id = com.sub_building_id
                WHERE sub.id = {sub_building_id}) AS total_formwork,
                    
                (SELECT SUM(rebar_weight) FROM structure3.rebar reb
                JOIN structure3.component com ON com.id = reb.component_id
                JOIN structure3.sub_building sub ON sub.id = com.sub_building_id
                WHERE sub.id = {sub_building_id}) AS total_rebar
            ) AS sub_table
    """

    analysis_data_df = pd.read_sql(query, engine)
    return JSONResponse(analysis_data_df.to_json(force_ascii=False, orient="records"))


# 총괄분석표 한개의 sub_building 2
@router.get("/sub_building/total_analysis_table/2/{sub_building_id}")
@exception_handler
async def get_total_analysis_data4(sub_building_id: int, token: TokenData = Depends(verify_user)):
    query = f"""
        SELECT c.component_type,
        SUM(concrete_volume) AS concrete_volume,
        SUM(formwork_area) AS formwork_area,
        SUM(rebar_weight) AS rebar_weight,
        (SUM(concrete_volume) / (SELECT SUM(volume) 
        FROM concrete WHERE component_id IN (SELECT id FROM component 
        WHERE sub_building_id IN (SELECT id FROM sub_building 
        WHERE id = {sub_building_id}))) * 100)
        AS concrete_percentage,
        (SUM(formwork_area) / (SELECT SUM(area) 
        FROM formwork WHERE component_id IN (SELECT id FROM component 
        WHERE sub_building_id IN (SELECT id FROM sub_building 
        WHERE id = {sub_building_id}))) * 100) 
        AS formwork_percentage,
        (SUM(rebar_weight) / (SELECT SUM(rebar_weight) 
        FROM rebar WHERE component_id IN (SELECT id FROM component 
        WHERE sub_building_id IN (SELECT id FROM sub_building 
        WHERE id = {sub_building_id}))) * 100) 
        AS rebar_percentage
        FROM (
            SELECT component.component_type
            FROM component
            GROUP BY component.component_type
        ) AS c
        LEFT JOIN (
            SELECT component.component_type, SUM(concrete.volume) AS concrete_volume
            FROM concrete
            JOIN component ON concrete.component_id = component.id
            JOIN sub_building ON component.sub_building_id = sub_building.id
            WHERE sub_building.id = {sub_building_id}
            GROUP BY component.component_type
        ) AS cv ON c.component_type = cv.component_type
        LEFT JOIN (
            SELECT component.component_type, SUM(formwork.area) AS formwork_area
            FROM formwork
            JOIN component ON formwork.component_id = component.id
            JOIN sub_building ON component.sub_building_id = sub_building.id
            WHERE sub_building.id = {sub_building_id}
            GROUP BY component.component_type
        ) AS fa ON c.component_type = fa.component_type
        LEFT JOIN (
            SELECT component.component_type, SUM(rebar.rebar_weight) AS rebar_weight
            FROM rebar
            JOIN component ON rebar.component_id = component.id
            JOIN sub_building ON component.sub_building_id = sub_building.id
            WHERE sub_building.id = {sub_building_id}
            GROUP BY component.component_type
        ) AS rw ON c.component_type = rw.component_type
        GROUP BY c.component_type
        HAVING concrete_volume IS NOT NULL
            AND formwork_area IS NOT NULL
            AND rebar_weight IS NOT NULL
        ORDER BY c.component_type;
    """

    analysis_data_df = pd.read_sql(query, engine)
    return JSONResponse(analysis_data_df.to_json(force_ascii=False, orient="records"))


### 분석표 ###
# 분석표 전체 sub_building
@router.get("/sub_building/analysis_table_all/{building_id}/concrete")
@exception_handler
async def get_pivot_analysis_concrete_data1(building_id: int, token: TokenData = Depends(verify_user)):
    concrete_query = f"""
        SELECT component_type, material_name, 
        SUM(concrete.volume) AS total_volume FROM concrete
        JOIN component ON concrete.component_id = component.id
        JOIN sub_building ON component.sub_building_id = sub_building.id
        WHERE sub_building.building_id = {building_id}
        GROUP BY component_type, material_name
        ORDER BY component_type
    """

    concrete_analysis_data_df = pd.read_sql(concrete_query, engine)
    concrete_analysis_data_pivot_df = concrete_analysis_data_df.pivot(
        index="component_type",
        columns="material_name",
        values="total_volume",
    )

    return JSONResponse(
        concrete_analysis_data_pivot_df.to_json(force_ascii=False, orient="index")
    )


# 분석표 전체 sub_building에서 formwork 데이터 보이기
@router.get("/sub_building/analysis_table_all/{building_id}/formwork")
@exception_handler
async def get_pivot_analysis_formwork_data1(building_id: int, token: TokenData = Depends(verify_user)):
    formwork_query = f"""
        SELECT component_type, formwork_type, 
        SUM(formwork.area) AS total_area FROM formwork
        JOIN component ON formwork.component_id = component.id
        JOIN sub_building ON component.sub_building_id = sub_building.id
        WHERE sub_building.building_id = {building_id}
        GROUP BY component_type, formwork_type
        ORDER BY component_type
    """

    formwork_analysis_data_df = pd.read_sql(formwork_query, engine)
    formwork_analysis_data_pivot_df = formwork_analysis_data_df.pivot(
        index="component_type",
        columns="formwork_type",
        values="total_area",
    )

    return JSONResponse(
        formwork_analysis_data_pivot_df.to_json(force_ascii=False, orient="index")
    )
    

# 분석표 전체 sub_building에서 rebar 데이터 보이기
@router.get("/sub_building/analysis_table_all/{building_id}/rebar")
@exception_handler
async def get_analysis_rebar_data1(building_id: int, token: TokenData = Depends(verify_user)):
    rebar_query = f"""
        SELECT component_type, rebar_grade, 
        CAST(rebar_diameter AS signed integer) AS rebar_diameter,
        SUM(rebar.rebar_unit_weight) AS total_weight FROM rebar
        JOIN component ON rebar.component_id = component.id
        JOIN sub_building ON component.sub_building_id = sub_building.id
        WHERE sub_building.building_id = {building_id}
        GROUP BY component_type, rebar_grade, rebar_diameter
        ORDER BY component_type
    """

    rebar_analysis_data_df = pd.read_sql(rebar_query, engine)

    return JSONResponse(
        rebar_analysis_data_df.to_json(force_ascii=False, orient="records")
    )


# 분석표 sub_building 1개
@router.get("/sub_building/analysis_table/{sub_building_id}/concrete")
@exception_handler
async def get_pivot_analysis_concrete_data2(sub_building_id: int, token: TokenData = Depends(verify_user)):
    concrete_query = f"""
        SELECT component_type, material_name, 
        SUM(concrete.volume) AS total_volume FROM concrete
        JOIN component ON concrete.component_id = component.id
        JOIN sub_building ON component.sub_building_id = sub_building.id
        WHERE sub_building.id = {sub_building_id}
        GROUP BY component_type, material_name
        ORDER BY component_type
    """

    concrete_analysis_data_df = pd.read_sql(concrete_query, engine)
    concrete_analysis_data_pivot_df = concrete_analysis_data_df.pivot(
        index="component_type",
        columns="material_name",
        values="total_volume",
    )

    return JSONResponse(
        concrete_analysis_data_pivot_df.to_json(force_ascii=False, orient="index")
    )


# 분석표 sub_building 1개에서 formwork 데이터 보이기
@router.get("/sub_building/analysis_table/{sub_building_id}/formwork")
@exception_handler
async def get_pivot_analysis_formwork_data2(sub_building_id: int, token: TokenData = Depends(verify_user)):
    formwork_query = f"""
        SELECT component_type, formwork_type, 
        SUM(formwork.area) AS total_area FROM formwork
        JOIN component ON formwork.component_id = component.id
        JOIN sub_building ON component.sub_building_id = sub_building.id
        WHERE sub_building.id = {sub_building_id}
        GROUP BY component_type, formwork_type
        ORDER BY component_type
    """

    formwork_analysis_data_df = pd.read_sql(formwork_query, engine)
    formwork_analysis_data_pivot_df = formwork_analysis_data_df.pivot(
        index="component_type",
        columns="formwork_type",
        values="total_area",
    )

    return JSONResponse(
        formwork_analysis_data_pivot_df.to_json(force_ascii=False, orient="index")
    )


# 분석표 sub_building 1개에서 rebar 데이터 보이기
@router.get("/sub_building/analysis_table/{sub_building_id}/rebar")
@exception_handler
async def get_analysis_rebar_data2(sub_building_id: int, token: TokenData = Depends(verify_user)):
    rebar_query = f"""
        SELECT component_type, rebar_grade, 
        CAST(rebar_diameter AS signed integer) AS rebar_diameter,
        SUM(rebar.rebar_unit_weight) AS total_weight FROM rebar
        JOIN component ON rebar.component_id = component.id
        JOIN sub_building ON component.sub_building_id = sub_building.id
        WHERE sub_building.id = {sub_building_id}
        GROUP BY component_type, rebar_grade, rebar_diameter
        ORDER BY component_type
    """

    rebar_analysis_data_df = pd.read_sql(rebar_query, engine)

    return JSONResponse(
        rebar_analysis_data_df.to_json(force_ascii=False, orient="records")
    )


@router.get("/sub_building/analysis_table/{sub_building_id}/concrete/table")
@exception_handler
async def draw_analysis_concrete2(sub_building_id: int, token: TokenData = Depends(verify_user)):
    concrete_query = f"""
        SELECT component_type, material_name, 
        SUM(concrete.volume) AS total_volume FROM concrete
        JOIN component ON concrete.component_id = component.id
        JOIN sub_building ON component.sub_building_id = sub_building.id
        WHERE sub_building.id = {sub_building_id}
        GROUP BY component_type, material_name
        ORDER BY component_type
    """

    concrete_analysis_data_df = pd.read_sql(concrete_query, engine)
    concrete_analysis_data_pivot_df = concrete_analysis_data_df.pivot(
        index="component_type",
        columns="material_name",
        values="total_volume",
    )
    
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
    query=f"""
        SELECT component_type FROM formwork
        JOIN component ON component.id = formwork.component_id
        JOIN sub_building ON sub_building.id = component.sub_building_id
        JOIN building ON building.id = sub_building	.building_id
        WHERE building.id = {building_id}
        GROUP BY component_type
        ORDER BY component_type
    """
    
    component_type_data = pd.read_sql(query, engine)
    
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
    
    query = f"""
        SELECT floor_name, material_name, floor_number,
        SUM(concrete.volume) AS total_volume FROM concrete
        JOIN component ON concrete.component_id = component.id
        JOIN floor ON component.floor_id = floor.id
        JOIN building ON floor.building_id = building.id
        WHERE building.id = {building_id}
        AND component.component_type IN ({component_types})
        GROUP BY floor_name, concrete.material_name, floor_number
        ORDER BY floor_number DESC
    """

    concrete_floor_analysis_data_df = pd.read_sql(query, engine)
    concrete_floor_analysis_data_pivot_df = concrete_floor_analysis_data_df.pivot_table(
        index="floor_name",
        columns="material_name",
        values="total_volume",
        sort=False,
    )

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
    
    query = f"""
        SELECT floor_name, formwork_type, floor_number,
        SUM(formwork.area) AS total_area FROM formwork
        JOIN component ON formwork.component_id = component.id
        JOIN floor ON component.floor_id = floor.id
        JOIN building ON floor.building_id = building.id
        WHERE building.id = {building_id}
        AND component.component_type IN ({component_types})
        GROUP BY floor_name, formwork_type, floor_number
        ORDER BY floor_number DESC
    """

    formwork_floor_analysis_data_df = pd.read_sql(query, engine)

    formwork_floor_analysis_data_pivot_df = formwork_floor_analysis_data_df.pivot_table(
        index="floor_name",
        columns="formwork_type",
        values="total_area",
        sort=False,
    )

    return JSONResponse(
        formwork_floor_analysis_data_pivot_df.to_json(force_ascii=False, orient="index")
    )
    
# 철근
@router.get("/sub_building/floor_analysis_table/{building_id}/rebar/filter")
@exception_handler
async def get_floor_analysis_rebar_filtered(building_id: int, component_types: str, token: TokenData = Depends(verify_user)):
    component_types = json.loads(component_types)
    component_types=', '.join(f'"{x}"' for x in component_types)
    
    query = f"""
        SELECT floor_name, rebar_grade, floor_number,
        CAST(rebar_diameter AS signed integer) AS rebar_diameter,
        SUM(rebar.rebar_unit_weight) AS total_rebar FROM rebar
        JOIN component ON rebar.component_id = component.id
        JOIN floor ON component.floor_id = floor.id
        JOIN building ON floor.building_id = building.id
        WHERE building.id = {building_id}
        AND component.component_type IN ({component_types})
        GROUP BY floor_name, rebar_grade, rebar_diameter, floor_number
        ORDER BY floor_number DESC
    """

    rebar_floor_analysis_data_df = pd.read_sql(query, engine)

    return JSONResponse(
        rebar_floor_analysis_data_df.to_json(force_ascii=False, orient="records")
    )
    
    
    
# 부재별로 타입 보이기
@router.get("/sub_building/quantity_detail/get_quantity_list/{building_id}")
@exception_handler
async def get_quantity_list(building_id: int, token: TokenData = Depends(verify_user)):
    sub_building_query = f"""
        SELECT id, sub_building_name FROM sub_building
        WHERE sub_building.building_id = {building_id}
        """
    
    floor_query = f"""
        SELECT f.id, floor_name, sub_building_id FROM component as c
        JOIN sub_building as s ON s.id = c.sub_building_id
        JOIN floor as f ON f.id = c.floor_id
        JOIN building as b ON b.id = f.building_id
        WHERE b.id = {building_id}
        GROUP BY f.id, floor_name, sub_building_id
    """
    
    component_query = f"""
        SELECT @index := @index + 1 AS id, sub.*
        FROM
        (SELECT floor_id, sub_building_id, component_type FROM component as c
        JOIN sub_building as s ON s.id = c.sub_building_id
        JOIN floor as f ON f.id = c.floor_id
        JOIN building as b ON b.id = f.building_id
        WHERE b.id = {building_id}
        GROUP BY floor_id, sub_building_id, component_type) as sub,
        (SELECT @index := 0) AS idx

    """
    
    sub_building_df = pd.read_sql(sub_building_query, engine)
    floor_df = pd.read_sql(floor_query, engine)
    component_df = pd.read_sql(component_query, engine)
    
    
    
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
    
    query = f"""
        SELECT s.*, component.*, {conformreb}.*, floor_name FROM sub_building as s
        JOIN component ON component.sub_building_id = s.id
        JOIN {conformreb} ON {conformreb}.component_id = component.id
        JOIN floor ON floor.id = component.floor_id
        WHERE component.sub_building_id IN {sub_building_ids}
        AND component.floor_id IN {floor_ids}
        AND component.component_type IN {component_names}
    """
    
    data_df = pd.read_sql(query, engine)
    
    return JSONResponse(data_df.to_json(force_ascii=False, orient="records"))