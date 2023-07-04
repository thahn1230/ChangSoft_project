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


# 총괄분석표 전체 sub_building 1
@router.get("/sub_building/total_analysis_table1/{building_id}")
def get_total_analysis_data1(building_id: int):
    query = f"""
        SELECT *, 
        ROUND((total_concrete / total_floor_area_meter), 2) AS con_floor_area_meter,
        ROUND((total_formwork / total_floor_area_meter), 2) AS form_floor_area_meter,
        ROUND((total_rebar / total_floor_area_meter), 2) AS reb_floor_area_meter,
        ROUND((total_concrete / total_floor_area_pyeong), 2) AS con_floor_area_pyeong,
        ROUND((total_formwork / total_floor_area_pyeong), 2) AS form_floor_area_pyeong,
        ROUND((total_rebar / total_floor_area_pyeong), 2) AS reb_floor_area_pyeong,
        ROUND((total_formwork / total_concrete), 2) AS form_con_result,
        ROUND((total_rebar / total_concrete), 2) AS reb_con_result
        FROM (SELECT
                ROUND((SELECT SUM(volume) FROM structure3.concrete AS con
                JOIN structure3.component AS com ON com.id = con.component_id
                JOIN structure3.sub_building AS sub ON sub.id = com.sub_building_id
                WHERE sub.building_id = {building_id}), 2) AS total_concrete,
                
                ROUND((SELECT SUM(area) FROM structure3.formwork AS form
                JOIN structure3.component AS com ON com.id = form.component_id
                JOIN structure3.sub_building AS sub ON sub.id = com.sub_building_id
                WHERE sub.building_id = {building_id}), 2) AS total_formwork,
                    
                ROUND((SELECT SUM(rebar_weight) FROM structure3.rebar AS reb
                JOIN structure3.component AS com ON com.id = reb.component_id
                JOIN structure3.sub_building AS sub ON sub.id = com.sub_building_id
                WHERE sub.building_id = {building_id}), 2) AS total_rebar,

                ROUND((SELECT SUM(floor.floor_area / 1000000)
                FROM floor
                JOIN building ON floor.building_id = building.id
                WHERE building.id = {building_id}), 2) AS total_floor_area_meter,
                
                ROUND((SELECT SUM((floor.floor_area / 1000000) * 0.3025)
                FROM floor
                JOIN building ON floor.building_id = building.id
                WHERE building.id = {building_id}), 2) AS total_floor_area_pyeong
            ) AS sub_table
    """

    total_analysis_data_df = pd.read_sql(query, engine)
    return JSONResponse(
        total_analysis_data_df.to_json(force_ascii=False, orient="records")
    )


# 총괄분석표 전체 sub_building 2
@router.get("/sub_building/total_analysis_table2/{building_id}")
def get_total_analysis_data2(building_id: int):
    query = f"""
        SELECT c.component_type,
        ROUND(SUM(concrete_volume), 2) AS concrete_volume,
        ROUND(SUM(formwork_area), 2) AS formwork_area,
        ROUND(SUM(rebar_weight), 2) AS rebar_weight,
        ROUND((SUM(concrete_volume) / (SELECT SUM(volume) FROM concrete 
        WHERE component_id 
        IN (SELECT id FROM component WHERE sub_building_id IN 
        (SELECT id FROM sub_building WHERE building_id = {building_id})))) * 100, 2) 
        AS concrete_percentage,
        ROUND((SUM(formwork_area) / (SELECT SUM(area) FROM formwork WHERE component_id 
        IN (SELECT id FROM component WHERE sub_building_id IN 
        (SELECT id FROM sub_building 
        WHERE building_id = {building_id})))) * 100, 2) 
        AS formwork_percentage,
        ROUND((SUM(rebar_weight) / (SELECT SUM(rebar_weight) FROM rebar 
        WHERE component_id 
        IN (SELECT id FROM component WHERE sub_building_id IN 
        (SELECT id FROM sub_building 
        WHERE building_id = {building_id})))) * 100, 2) AS rebar_percentage
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
@router.get("/sub_building/analysis_table1/{sub_building_id}")
def get_analysis_data1(sub_building_id: int):
    query = f"""
        SELECT * , ROUND((total_formwork / total_concrete), 2) AS form_con_result,
        ROUND((total_rebar / total_concrete), 2) AS reb_con_result 
        FROM (SELECT
                ROUND((SELECT SUM(volume) FROM structure3.concrete con
                JOIN structure3.component com ON com.id = con.component_id
                JOIN structure3.sub_building sub ON sub.id = com.sub_building_id
                WHERE sub.id = {sub_building_id}), 2) AS total_concrete,
                
                ROUND((SELECT SUM(area) FROM structure3.formwork form
                JOIN structure3.component com ON com.id = form.component_id
                JOIN structure3.sub_building sub ON sub.id = com.sub_building_id
                WHERE sub.id = {sub_building_id}), 2) AS total_formwork,
                    
                ROUND((SELECT SUM(rebar_weight) FROM structure3.rebar reb
                JOIN structure3.component com ON com.id = reb.component_id
                JOIN structure3.sub_building sub ON sub.id = com.sub_building_id
                WHERE sub.id = {sub_building_id}), 2) AS total_rebar
            ) AS sub_table
    """

    analysis_data_df = pd.read_sql(query, engine)
    return JSONResponse(analysis_data_df.to_json(force_ascii=False, orient="records"))


# 총괄분석표 한개의 sub_building 2
@router.get("/sub_building/analysis_table2/{sub_building_id}")
def get_analysis_data2(sub_building_id: int):
    query = f"""
        SELECT c.component_type,
        ROUND(SUM(concrete_volume), 2) AS concrete_volume,
        ROUND(SUM(formwork_area), 2) AS formwork_area,
        ROUND(SUM(rebar_weight), 2) AS rebar_weight,
        ROUND((SUM(concrete_volume) / (SELECT SUM(volume) 
        FROM concrete WHERE component_id IN (SELECT id FROM component 
        WHERE sub_building_id IN (SELECT id FROM sub_building 
        WHERE id = {sub_building_id})))) * 100, 2) 
        AS concrete_percentage,
        ROUND((SUM(formwork_area) / (SELECT SUM(area) 
        FROM formwork WHERE component_id IN (SELECT id FROM component 
        WHERE sub_building_id IN (SELECT id FROM sub_building 
        WHERE id = {sub_building_id})))) * 100, 2) 
        AS formwork_percentage,
        ROUND((SUM(rebar_weight) / (SELECT SUM(rebar_weight) 
        FROM rebar WHERE component_id IN (SELECT id FROM component 
        WHERE sub_building_id IN (SELECT id FROM sub_building 
        WHERE id = {sub_building_id})))) * 100, 2) 
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
