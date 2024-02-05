from ..database import Database

import pandas as pd

engine = Database().get_engine()

def get_subBuilding_df(building_id: int):
    query = f"""
        SELECT * FROM sub_building
        WHERE sub_building.building_id = {building_id}
    """
    
    params = {'building_id': building_id}
    sub_building_df = pd.read_sql(query, engine, params=params)
    return sub_building_df

def get_all_subBuilding_analysis1_df(building_id: int):
    query = """
    SELECT
        total_concrete,
        total_formwork,
        total_rebar,
        total_floor_area_meter,
        total_floor_area_pyeong,
        (total_concrete / total_floor_area_meter) AS con_floor_area_meter,
        (total_formwork / total_floor_area_meter) AS form_floor_area_meter,
        (total_rebar / total_floor_area_meter) AS reb_floor_area_meter,
        (total_concrete / total_floor_area_pyeong) AS con_floor_area_pyeong,
        (total_formwork / total_floor_area_pyeong) AS form_floor_area_pyeong,
        (total_rebar / total_floor_area_pyeong) AS reb_floor_area_pyeong,
        (total_formwork / total_concrete) AS form_con_result,
        (total_rebar / total_concrete) AS reb_con_result
    FROM (
        SELECT
            (SELECT SUM(volume) FROM structure3.concrete AS con
            JOIN structure3.component AS com ON com.id = con.component_id
            JOIN structure3.sub_building AS sub ON sub.id = com.sub_building_id
            WHERE sub.building_id = %s) AS total_concrete,
                    
            (SELECT SUM(area) FROM structure3.formwork AS form
            JOIN structure3.component AS com ON com.id = form.component_id
            JOIN structure3.sub_building AS sub ON sub.id = com.sub_building_id
            WHERE sub.building_id = %s) AS total_formwork,
                        
            (SELECT SUM(rebar_weight) FROM structure3.rebar AS reb
            JOIN structure3.component AS com ON com.id = reb.component_id
            JOIN structure3.sub_building AS sub ON sub.id = com.sub_building_id
            WHERE sub.building_id = %s) AS total_rebar,

            (SELECT SUM(floor.floor_area / 1000000)
            FROM floor
            JOIN building ON floor.building_id = building.id
            WHERE building.id = %s) AS total_floor_area_meter,
                    
            (SELECT SUM((floor.floor_area / 1000000) * 0.3025)
            FROM floor
            JOIN building ON floor.building_id = building.id
            WHERE building.id = %s) AS total_floor_area_pyeong
    ) AS sub_table
    """

    params = (building_id, building_id, building_id, building_id, building_id)
    total_analysis_data_df = pd.read_sql(query, engine, params=params)
    
    return total_analysis_data_df

def get_all_subBuilding_analysis2_df(building_id: int):
    query = """
        SELECT c.component_type,
        SUM(concrete_volume) AS concrete_volume,
        SUM(formwork_area) AS formwork_area,
        SUM(rebar_weight) AS rebar_weight,
        (SUM(concrete_volume) / (SELECT SUM(volume) FROM concrete 
        WHERE component_id 
        IN (SELECT id FROM component WHERE sub_building_id IN 
        (SELECT id FROM sub_building WHERE building_id = %s))) * 100)
        AS concrete_percentage,
        (SUM(formwork_area) / (SELECT SUM(area) FROM formwork WHERE component_id 
        IN (SELECT id FROM component WHERE sub_building_id IN 
        (SELECT id FROM sub_building 
        WHERE building_id = %s))) * 100) 
        AS formwork_percentage,
        (SUM(rebar_weight) / (SELECT SUM(rebar_weight) FROM rebar 
        WHERE component_id 
        IN (SELECT id FROM component WHERE sub_building_id IN 
        (SELECT id FROM sub_building 
        WHERE building_id = %s))) * 100) AS rebar_percentage
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
            WHERE sub_building.building_id = %s
            GROUP BY component.component_type
        ) AS cv ON c.component_type = cv.component_type
        LEFT JOIN (
            SELECT component.component_type, SUM(formwork.area) AS formwork_area
            FROM formwork
            JOIN component ON formwork.component_id = component.id
            JOIN sub_building ON component.sub_building_id = sub_building.id
            WHERE sub_building.building_id = %s
            GROUP BY component.component_type
        ) AS fa ON c.component_type = fa.component_type
        LEFT JOIN (
            SELECT component.component_type, SUM(rebar.rebar_weight) AS rebar_weight
            FROM rebar
            JOIN component ON rebar.component_id = component.id
            JOIN sub_building ON component.sub_building_id = sub_building.id
            WHERE sub_building.building_id = %s
            GROUP BY component.component_type
        ) AS rw ON c.component_type = rw.component_type
        GROUP BY c.component_type
        HAVING concrete_volume IS NOT NULL
            AND formwork_area IS NOT NULL
            AND rebar_weight IS NOT NULL
        ORDER BY c.component_type;
    """

    params = (building_id, building_id, building_id, building_id, building_id, building_id)
    total_analysis_data_df = pd.read_sql(query, engine, params=params)
    return total_analysis_data_df

def get_single_subBuilding_analysis1_df(sub_building_id: int):
    query = """
        SELECT *,
        (total_formwork / total_concrete) AS form_con_result,
        (total_rebar / total_concrete) AS reb_con_result
        FROM (SELECT
                (SELECT SUM(volume) FROM structure3.concrete con
                JOIN structure3.component com ON com.id = con.component_id
                JOIN structure3.sub_building sub ON sub.id = com.sub_building_id
                WHERE sub.id = %s) AS total_concrete,
                
                (SELECT SUM(area) FROM structure3.formwork form
                JOIN structure3.component com ON com.id = form.component_id
                JOIN structure3.sub_building sub ON sub.id = com.sub_building_id
                WHERE sub.id = %s) AS total_formwork,
                    
                (SELECT SUM(rebar_weight) FROM structure3.rebar reb
                JOIN structure3.component com ON com.id = reb.component_id
                JOIN structure3.sub_building sub ON sub.id = com.sub_building_id
                WHERE sub.id = %s) AS total_rebar
            ) AS sub_table
    """

    params = (sub_building_id, sub_building_id, sub_building_id)
    analysis_data_df = pd.read_sql(query, engine, params=params)
    
    return analysis_data_df

def get_single_subBuilding_analysis2_df(sub_building_id: int):
    query = """
        SELECT c.component_type,
        SUM(concrete_volume) AS concrete_volume,
        SUM(formwork_area) AS formwork_area,
        SUM(rebar_weight) AS rebar_weight,
        (SUM(concrete_volume) / (SELECT SUM(volume) 
        FROM concrete WHERE component_id IN (SELECT id FROM component 
        WHERE sub_building_id IN (SELECT id FROM sub_building 
        WHERE id = %s))) * 100)
        AS concrete_percentage,
        (SUM(formwork_area) / (SELECT SUM(area) 
        FROM formwork WHERE component_id IN (SELECT id FROM component 
        WHERE sub_building_id IN (SELECT id FROM sub_building 
        WHERE id = %s))) * 100) 
        AS formwork_percentage,
        (SUM(rebar_weight) / (SELECT SUM(rebar_weight) 
        FROM rebar WHERE component_id IN (SELECT id FROM component 
        WHERE sub_building_id IN (SELECT id FROM sub_building 
        WHERE id = %s))) * 100) 
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
            WHERE sub_building.id = %s
            GROUP BY component.component_type
        ) AS cv ON c.component_type = cv.component_type
        LEFT JOIN (
            SELECT component.component_type, SUM(formwork.area) AS formwork_area
            FROM formwork
            JOIN component ON formwork.component_id = component.id
            JOIN sub_building ON component.sub_building_id = sub_building.id
            WHERE sub_building.id = %s
            GROUP BY component.component_type
        ) AS fa ON c.component_type = fa.component_type
        LEFT JOIN (
            SELECT component.component_type, SUM(rebar.rebar_weight) AS rebar_weight
            FROM rebar
            JOIN component ON rebar.component_id = component.id
            JOIN sub_building ON component.sub_building_id = sub_building.id
            WHERE sub_building.id = %s
            GROUP BY component.component_type
        ) AS rw ON c.component_type = rw.component_type
        GROUP BY c.component_type
        HAVING concrete_volume IS NOT NULL
            AND formwork_area IS NOT NULL
            AND rebar_weight IS NOT NULL
        ORDER BY c.component_type;
    """

    params = (sub_building_id, sub_building_id, sub_building_id, sub_building_id, sub_building_id, sub_building_id)
    analysis_data_df = pd.read_sql(query, engine, params=params)

    return analysis_data_df


def get_all_subbuilding_concrete_pivot(building_id: int):
    query = """
        SELECT component_type, material_name, 
        SUM(concrete.volume) AS total_volume FROM concrete
        JOIN component ON concrete.component_id = component.id
        JOIN sub_building ON component.sub_building_id = sub_building.id
        WHERE sub_building.building_id = %s
        GROUP BY component_type, material_name
        ORDER BY component_type
    """

    params = (building_id, )
    concrete_analysis_data_df = pd.read_sql(query, engine, params=params)
    concrete_analysis_data_pivot_df = concrete_analysis_data_df.pivot(
        index="component_type",
        columns="material_name",
        values="total_volume",
    )

    return concrete_analysis_data_pivot_df


def get_all_subbuilding_formwork_pivot(building_id: int):
    query = """
        SELECT component_type, formwork_type, 
        SUM(formwork.area) AS total_area FROM formwork
        JOIN component ON formwork.component_id = component.id
        JOIN sub_building ON component.sub_building_id = sub_building.id
        WHERE sub_building.building_id = %s
        GROUP BY component_type, formwork_type
        ORDER BY component_type
    """

    params = (building_id, )
    formwork_analysis_data_df = pd.read_sql(query, engine, params=params)
    formwork_analysis_data_pivot_df = formwork_analysis_data_df.pivot(
        index="component_type",
        columns="formwork_type",
        values="total_area",
    )

    return formwork_analysis_data_pivot_df

def get_all_subbuilding_rebar_df(building_id: int):
    query = """
        SELECT component_type, rebar_grade, 
        CAST(rebar_diameter AS signed integer) AS rebar_diameter,
        SUM(rebar.rebar_unit_weight) AS total_weight FROM rebar
        JOIN component ON rebar.component_id = component.id
        JOIN sub_building ON component.sub_building_id = sub_building.id
        WHERE sub_building.building_id = %s
        GROUP BY component_type, rebar_grade, rebar_diameter
        ORDER BY component_type
    """

    params = (building_id, )
    rebar_analysis_data_df = pd.read_sql(query, engine, params=params)

    return rebar_analysis_data_df


def get_single_subbuilding_concrete_pivot(sub_building_id: int):
    query = """
        SELECT component_type, material_name, 
        SUM(concrete.volume) AS total_volume FROM concrete
        JOIN component ON concrete.component_id = component.id
        JOIN sub_building ON component.sub_building_id = sub_building.id
        WHERE sub_building.id = %s
        GROUP BY component_type, material_name
        ORDER BY component_type
    """

    params = (sub_building_id, )
    concrete_analysis_data_df = pd.read_sql(query, engine, params=params)
    concrete_analysis_data_pivot_df = concrete_analysis_data_df.pivot(
        index="component_type",
        columns="material_name",
        values="total_volume",
    )

    return concrete_analysis_data_pivot_df

def get_single_subbuilding_formwork_pivot(sub_building_id: int):
    query = """
        SELECT component_type, formwork_type, 
        SUM(formwork.area) AS total_area FROM formwork
        JOIN component ON formwork.component_id = component.id
        JOIN sub_building ON component.sub_building_id = sub_building.id
        WHERE sub_building.id = %s
        GROUP BY component_type, formwork_type
        ORDER BY component_type
    """

    params = (sub_building_id, )
    formwork_analysis_data_df = pd.read_sql(query, engine, params=params)
    formwork_analysis_data_pivot_df = formwork_analysis_data_df.pivot(
        index="component_type",
        columns="formwork_type",
        values="total_area",
    )

    return formwork_analysis_data_pivot_df

def get_single_subbuilding_rebar_df(sub_building_id: int):
    query = """
        SELECT component_type, rebar_grade, 
        CAST(rebar_diameter AS signed integer) AS rebar_diameter,
        SUM(rebar.rebar_unit_weight) AS total_weight FROM rebar
        JOIN component ON rebar.component_id = component.id
        JOIN sub_building ON component.sub_building_id = sub_building.id
        WHERE sub_building.id = %s
        GROUP BY component_type, rebar_grade, rebar_diameter
        ORDER BY component_type
    """

    params = (sub_building_id)
    rebar_analysis_data_df = pd.read_sql(query, engine, params=params)

    return rebar_analysis_data_df


def get_building_component_type(building_id: int):
    query="""
        SELECT component_type FROM formwork
        JOIN component ON component.id = formwork.component_id
        JOIN sub_building ON sub_building.id = component.sub_building_id
        JOIN building ON building.id = sub_building	.building_id
        WHERE building.id = %s
        GROUP BY component_type
        ORDER BY component_type
    """
    
    params = (building_id, )
    component_type_data = pd.read_sql(query, engine, params=params)

    return component_type_data


def get_building_concrete_pivot(building_id: int, component_types: str):
    query = """
        SELECT floor_name, material_name, floor_number,
        SUM(concrete.volume) AS total_volume FROM concrete
        JOIN component ON concrete.component_id = component.id
        JOIN floor ON component.floor_id = floor.id
        JOIN building ON floor.building_id = building.id
        WHERE building.id = %s
        AND component.component_type IN %s
        GROUP BY floor_name, concrete.material_name, floor_number
        ORDER BY floor_number DESC
    """
   
    params = (building_id, component_types)
    print(query % params)
    concrete_floor_analysis_data_df = pd.read_sql(query % params, engine)
    print(query % params)
    concrete_floor_analysis_data_pivot_df = concrete_floor_analysis_data_df.pivot_table(
        index="floor_name",
        columns="material_name",
        values="total_volume",
        sort=False,
    )
    return concrete_floor_analysis_data_pivot_df

def get_building_formwork_pivot(building_id: int, component_types: str):
    query = """
        SELECT floor_name, formwork_type, floor_number,
        SUM(formwork.area) AS total_area FROM formwork
        JOIN component ON formwork.component_id = component.id
        JOIN floor ON component.floor_id = floor.id
        JOIN building ON floor.building_id = building.id
        WHERE building.id = %s
        AND component.component_type IN (%s)
        GROUP BY floor_name, formwork_type, floor_number
        ORDER BY floor_number DESC
    """

    params = (building_id, component_types)
    formwork_floor_analysis_data_df = pd.read_sql(query, engine, params=params)

    formwork_floor_analysis_data_pivot_df = formwork_floor_analysis_data_df.pivot_table(
        index="floor_name",
        columns="formwork_type",
        values="total_area",
        sort=False,
    )

    return formwork_floor_analysis_data_pivot_df

def get_building_rebar_df(building_id: int, component_types: str):
    query = """
        SELECT floor_name, rebar_grade, floor_number,
        CAST(rebar_diameter AS signed integer) AS rebar_diameter,
        SUM(rebar.rebar_unit_weight) AS total_rebar FROM rebar
        JOIN component ON rebar.component_id = component.id
        JOIN floor ON component.floor_id = floor.id
        JOIN building ON floor.building_id = building.id
        WHERE building.id = %s
        AND component.component_type IN (%s)
        GROUP BY floor_name, rebar_grade, rebar_diameter, floor_number
        ORDER BY floor_number DESC
    """

    params = (building_id, component_types)
    rebar_floor_analysis_data_df = pd.read_sql(query, engine, params=params)

    return rebar_floor_analysis_data_df


def get_subbuilding_id_name_info(building_id: int):
    query = """
        SELECT id, sub_building_name FROM sub_building
        WHERE sub_building.building_id = %s
        """

    params = (building_id, )
    sub_building_df = pd.read_sql(query, engine, params=params)
    return sub_building_df

def get_subbuilding_floor_info(building_id: int):
    query = """
        SELECT f.id, floor_name, sub_building_id FROM component as c
        JOIN sub_building as s ON s.id = c.sub_building_id
        JOIN floor as f ON f.id = c.floor_id
        JOIN building as b ON b.id = f.building_id
        WHERE b.id = %s
        GROUP BY f.id, floor_name, sub_building_id
    """

    params = (building_id, )
    floor_df = pd.read_sql(query, engine, params=params)
    return floor_df

def get_subbuilding_component_info(building_id: int):
    query = """
        SELECT @index := @index + 1 AS id, sub.*
        FROM
        (SELECT floor_id, sub_building_id, component_type FROM component as c
        JOIN sub_building as s ON s.id = c.sub_building_id
        JOIN floor as f ON f.id = c.floor_id
        JOIN building as b ON b.id = f.building_id
        WHERE b.id = %s
        GROUP BY floor_id, sub_building_id, component_type) as sub,
        (SELECT @index := 0) AS idx
    """
    
    params = (building_id, )
    component_df = pd.read_sql(query, engine, params=params)
    return component_df


def get_component_info_df(conformreb, sub_building_ids, floor_ids, component_names):
    query = """
        SELECT s.*, component.*, {conformreb}.*, floor_name FROM sub_building as s
        JOIN component ON component.sub_building_id = s.id
        JOIN {conformreb} ON {conformreb}.component_id = component.id
        JOIN floor ON floor.id = component.floor_id
        WHERE component.sub_building_id IN {sub_building_ids}
        AND component.floor_id IN {floor_ids}
        AND component.component_type IN {component_names}
    """
    
    params = (conformreb, conformreb, conformreb, sub_building_ids, floor_ids, component_names)
    data_df = pd.read_sql(query, engine, params=params)

    return data_df