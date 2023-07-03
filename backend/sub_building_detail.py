from fastapi import APIRouter
from fastapi.responses import JSONResponse
import pandas as pd

from dbAccess import create_db_connection

router = APIRouter()
engine = create_db_connection()

# 빌딩 id의 맞는 sub building을 받기
@router.get("/sub_building/{building_id}")
def get_sub_building_data(building_id: int):
    query=f"""
        SELECT * FROM sub_building
        WHERE sub_building.building_id = {building_id}
    """
    
    sub_building_df = pd.read_sql(query, engine)
    return JSONResponse(sub_building_df.to_json(force_ascii=False, orient="records"))


# 총괄분석표 전체 sub_building 1
@router.get("/sub_building/total_analysis_table1/{building_id}")
def get_total_analysis_data1(building_id: int):
    query=f"""
        SELECT *, 
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
    
    analysis_data_df = pd.read_sql(query, engine)
    return JSONResponse(analysis_data_df.to_json(force_ascii=False, orient="records"))


# 총괄분석표 전체 sub_building 2
@router.get("/sub_building/total_analysis_table2/{building_id}")
def get_total_analysis_data2(building_id: int):
    query=f"""
        SELECT
        com.component_type,
        SUM(con.volume) AS con_total,
        SUM(con.volume) * 100.0 / totals.total_volume AS con_percentage,
        SUM(form.area) AS form_total,
        SUM(form.area) * 100.0 / totals.total_area AS form_percentage,
        SUM(reb.rebar_weight) AS reb_total,
        SUM(reb.rebar_weight) * 100.0 / totals.total_weight AS reb_percentage
        FROM
        component AS com
        JOIN sub_building AS sub ON com.sub_building_id = sub.id
        LEFT JOIN (
            SELECT
            con.component_id,
            SUM(con.volume) AS volume
            FROM
            concrete AS con
            JOIN component AS com ON con.component_id = com.id
            JOIN sub_building AS sub ON com.sub_building_id = sub.id
            WHERE
            sub.building_id = {building_id}
            GROUP BY
            con.component_id
        ) AS con ON com.id = con.component_id
        LEFT JOIN (
            SELECT
            form.component_id,
            SUM(form.area) AS area
            FROM
            formwork AS form
            JOIN component AS com ON form.component_id = com.id
            JOIN sub_building AS sub ON com.sub_building_id = sub.id
            WHERE
            sub.building_id = {building_id}
            GROUP BY
            form.component_id
        ) AS form ON com.id = form.component_id
        LEFT JOIN (
            SELECT
            reb.component_id,
            SUM(reb.rebar_weight) AS rebar_weight
            FROM
            rebar AS reb
            JOIN component AS com ON reb.component_id = com.id
            JOIN sub_building AS sub ON com.sub_building_id = sub.id
            WHERE
            sub.building_id = {building_id}
            GROUP BY
            reb.component_id
        ) AS reb ON com.id = reb.component_id
        JOIN (
            SELECT
            sub.id AS sub_id,
            SUM(con.volume) AS total_volume,
            SUM(form.area) AS total_area,
            SUM(reb.rebar_weight) AS total_weight
            FROM
            sub_building AS sub
            LEFT JOIN component AS com ON com.sub_building_id = sub.id
            LEFT JOIN concrete AS con ON con.component_id = com.id
            LEFT JOIN formwork AS form ON form.component_id = com.id
            LEFT JOIN rebar AS reb ON reb.component_id = com.id
            WHERE
            sub.building_id = {building_id}
            GROUP BY
            sub.id
        ) AS totals ON sub.id = totals.sub_id
        WHERE
        sub.building_id = {building_id}
        GROUP BY
        com.component_type, totals.total_volume, totals.total_area, totals.total_weight
        ORDER BY
        com.component_type;
    """
    
    analysis_data_df = pd.read_sql(query, engine)
    return JSONResponse(analysis_data_df.to_json(force_ascii=False, orient="records"))


# 총괄분석표 한개의 sub_building 1
@router.get("/sub_building/analysis_table1/{sub_building_id}")
def get_analysis_data1(sub_building_id: int):
    query=f"""
        SELECT * , (total_formwork / total_concrete) AS form_con_result,
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
@router.get("/sub_building/analysis_table2/{sub_building_id}")
def get_analysis_data2(sub_building_id: int):
    query=f"""
        SELECT
        com.component_type,
        SUM(con.volume) AS con_total,
        SUM(con.volume) * 100.0 / totals.total_volume AS con_percentage,
        SUM(form.area) AS form_total,
        SUM(form.area) * 100.0 / totals.total_area AS form_percentage,
        SUM(reb.rebar_weight) AS reb_total,
        SUM(reb.rebar_weight) * 100.0 / totals.total_weight AS reb_percentage
        FROM
        component AS com
        JOIN sub_building AS sub ON com.sub_building_id = sub.id
        LEFT JOIN (
            SELECT
            con.component_id,
            SUM(con.volume) AS volume
            FROM
            concrete AS con
            JOIN component AS com ON con.component_id = com.id
            JOIN sub_building AS sub ON com.sub_building_id = sub.id
            WHERE
            sub.id = {sub_building_id}
            GROUP BY
            con.component_id
        ) AS con ON com.id = con.component_id
        LEFT JOIN (
            SELECT
            form.component_id,
            SUM(form.area) AS area
            FROM
            formwork AS form
            JOIN component AS com ON form.component_id = com.id
            JOIN sub_building AS sub ON com.sub_building_id = sub.id
            WHERE
            sub.id = {sub_building_id}
            GROUP BY
            form.component_id
        ) AS form ON com.id = form.component_id
        LEFT JOIN (
            SELECT
            reb.component_id,
            SUM(reb.rebar_weight) AS rebar_weight
            FROM
            rebar AS reb
            JOIN component AS com ON reb.component_id = com.id
            JOIN sub_building AS sub ON com.sub_building_id = sub.id
            WHERE
            sub.id = {sub_building_id}
            GROUP BY
            reb.component_id
        ) AS reb ON com.id = reb.component_id
        JOIN (
            SELECT
            sub.id AS sub_id,
            SUM(con.volume) AS total_volume,
            SUM(form.area) AS total_area,
            SUM(reb.rebar_weight) AS total_weight
            FROM
            sub_building AS sub
            LEFT JOIN component AS com ON com.sub_building_id = sub.id
            LEFT JOIN concrete AS con ON con.component_id = com.id
            LEFT JOIN formwork AS form ON form.component_id = com.id
            LEFT JOIN rebar AS reb ON reb.component_id = com.id
            WHERE
            sub.id = {sub_building_id}
            GROUP BY
            sub.id
        ) AS totals ON sub.id = totals.sub_id
        WHERE
        sub.id = {sub_building_id}
        GROUP BY
        com.component_type, totals.total_volume, totals.total_area, totals.total_weight
        ORDER BY
        com.component_type;
    """
    
    analysis_data_df = pd.read_sql(query, engine)
    return JSONResponse(analysis_data_df.to_json(force_ascii=False, orient="records"))