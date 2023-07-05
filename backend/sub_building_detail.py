from fastapi import APIRouter
from fastapi.responses import JSONResponse
import pandas as pd

from dbAccess import create_db_connection

router = APIRouter()
engine = create_db_connection()


# 빌딩 id의 맞는 sub building을 받기
@router.get("/sub_building/{building_id}")
def get_sub_building_data(building_id: int):
    query = f"""
        SELECT * FROM sub_building
        WHERE sub_building.building_id = {building_id}
    """

    sub_building_df = pd.read_sql(query, engine)
    return JSONResponse(sub_building_df.to_json(force_ascii=False, orient="records"))


### 총괄분석표 ###


# 총괄분석표 전체 sub_building 1
@router.get("/sub_building/total_analysis_table_all/1/{building_id}")
def get_total_analysis_data1(building_id: int):
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
def get_total_analysis_data2(building_id: int):
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
def get_total_analysis_data3(sub_building_id: int):
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
def get_total_analysis_data4(sub_building_id: int):
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
# 분석표 한개의 sub_building에서 concrete 데이터 보이기
@router.get("/sub_building/analysis_table_all/{building_id}/concrete")
def get_analysis_concrete_data1(building_id: int):
    query = f"""
        SELECT component_type, material_name, 
        SUM(concrete.volume) AS total_concrete FROM concrete
        JOIN component ON concrete.component_id = component.id
        JOIN sub_building ON component.sub_building_id = sub_building.id
        WHERE sub_building.building_id = {building_id}
        GROUP BY component_type, material_name
        ORDER BY component_type
    """

    analysis_data_df = pd.read_sql(query, engine)
    return JSONResponse(analysis_data_df.to_json(force_ascii=False, orient="records"))


# 분석표 한개의 sub_building에서 formwork 데이터 보이기
@router.get("/sub_building/analysis_table_all/{building_id}/formwork")
def get_analysis_formwork_data1(building_id: int):
    query = f"""
        SELECT component_type, formwork_type, 
        SUM(formwork.area) AS total_formwork FROM formwork
        JOIN component ON formwork.component_id = component.id
        JOIN sub_building ON component.sub_building_id = sub_building.id
        WHERE sub_building.building_id = {building_id}
        GROUP BY component_type, formwork_type
        ORDER BY component_type
    """

    analysis_data_df = pd.read_sql(query, engine)
    return JSONResponse(analysis_data_df.to_json(force_ascii=False, orient="records"))


# 분석표 한개의 sub_building에서 rebar 데이터 보이기
@router.get("/sub_building/analysis_table_all/{building_id}/rebar")
def get_analysis_rebar_data1(building_id: int):
    query = f"""
        SELECT component_type, rebar_grade, rebar_diameter, 
        SUM(rebar.rebar_unit_weight) AS total_rebar FROM rebar
        JOIN component ON rebar.component_id = component.id
        JOIN sub_building ON component.sub_building_id = sub_building.id
        WHERE sub_building.building_id = {building_id}
        GROUP BY component_type, rebar_grade, rebar_diameter
        ORDER BY component_type
    """

    analysis_data_df = pd.read_sql(query, engine)
    return JSONResponse(analysis_data_df.to_json(force_ascii=False, orient="records"))


# 분석표 전체의 sub_building에서 concrete 데이터 보이기
@router.get("/sub_building/analysis_table/{sub_building_id}/concrete")
def get_analysis_concrete_data2(sub_building_id: int):
    query = f"""
        SELECT component_type, material_name, 
        SUM(concrete.volume) AS total_concrete FROM concrete
        JOIN component ON concrete.component_id = component.id
        JOIN sub_building ON component.sub_building_id = sub_building.id
        WHERE sub_building.id = {sub_building_id}
        GROUP BY component_type, material_name
        ORDER BY component_type
    """

    analysis_data_df = pd.read_sql(query, engine)
    return JSONResponse(analysis_data_df.to_json(force_ascii=False, orient="records"))


# 분석표 한개의 sub_building에서 formwork 데이터 보이기
@router.get("/sub_building/analysis_table/{sub_building_id}/formwork")
def get_analysis_formwork_data2(sub_building_id: int):
    query = f"""
        SELECT component_type, formwork_type, 
        SUM(formwork.area) AS total_formwork FROM formwork
        JOIN component ON formwork.component_id = component.id
        JOIN sub_building ON component.sub_building_id = sub_building.id
        WHERE sub_building.id = {sub_building_id}
        GROUP BY component_type, formwork_type
        ORDER BY component_type
    """

    analysis_data_df = pd.read_sql(query, engine)
    return JSONResponse(analysis_data_df.to_json(force_ascii=False, orient="records"))


# 분석표 한개의 sub_building에서 rebar 데이터 보이기
@router.get("/sub_building/analysis_table/{sub_building_id}/rebar")
def get_analysis_rebar_data2(sub_building_id: int):
    query = f"""
        SELECT component_type, rebar_grade, rebar_diameter, 
        SUM(rebar.rebar_unit_weight) AS total_rebar FROM rebar
        JOIN component ON rebar.component_id = component.id
        JOIN sub_building ON component.sub_building_id = sub_building.id
        WHERE sub_building.id = {sub_building_id}
        GROUP BY component_type, rebar_grade, rebar_diameter
        ORDER BY component_type
    """

    analysis_data_df = pd.read_sql(query, engine)
    return JSONResponse(analysis_data_df.to_json(force_ascii=False, orient="records"))
