from ..database import Database

import pandas as pd

engine = Database().get_engine()

# 파라미터 바인딩 꼭 하기

def get_table_list():
    query = """
        SELECT TABLE_NAME
        FROM information_schema.tables
        WHERE table_schema = 'structure3'
    """
    valid_attributes = pd.read_sql(query,engine)["TABLE_NAME"].to_list()

    return valid_attributes

def get_table_attributes(table_name: str):
    query = f"""
        SELECT * FROM {table_name};
    """


    table_df = pd.read_sql(query, engine)
    
    return table_df

def get_table_count(table_name: str):
    query = f"SELECT COUNT(*) as count FROM structure3.{table_name};"

    table_count_df = pd.read_sql(query, engine)

    table_count = int(table_count_df['count'].iloc[0])
    
    return table_count
    
def get_project_detail_df(project_id: int):
    query = """
        SELECT p.project_name, p.building_area, p.construction_company, 
        p.location, p.total_area, p.construction_start, p.construction_end,
        (p.construction_end-p.construction_start) AS total_date,
        COUNT(*) AS building_count
        FROM structure3.project AS p
        JOIN structure3.building AS b ON p.id = b.project_id
        WHERE p.id = %s;
    """

    params = (project_id,)
    project_detail_df = pd.read_sql(query, engine, params=params)

    return project_detail_df

def get_building_df(project_id: int):
    query="""
        SELECT building.* 
        FROM project
        JOIN building ON project.id = building.project_id
        WHERE project.id = %s;
    """

    params = (project_id,)
    building_detail_df = pd.read_sql(query, engine, params=params)

    return building_detail_df

def get_project_usage_df():
    query = """
        SELECT structure3.project.usage as field, COUNT(*) as count, 
        COUNT(*) * 100.0 / SUM(COUNT(*)) OVER() AS percentage
        FROM structure3.project 
        GROUP BY structure3.project.usage
        ORDER BY percentage DESC;
    """

    project_usage_df = pd.read_sql(query, engine)
    return project_usage_df

def get_project_construction_company_df():
    query = """
        SELECT structure3.project.construction_company as field, COUNT(*) as count,
        COUNT(*) * 100.0 / SUM(COUNT(*)) OVER() AS percentage 
        FROM structure3.project 
        GROUP BY structure3.project.construction_company
        ORDER BY percentage DESC;
    """

    project_construction_company_df = pd.read_sql(query, engine)
    return project_construction_company_df

def get_project_location_df():
    query = """
        SELECT structure3.project.location as field, COUNT(*) as count,
        COUNT(*) * 100.0 / SUM(COUNT(*)) OVER() AS percentage
        FROM structure3.project 
        GROUP BY structure3.project.location
        ORDER BY percentage DESC;
    """

    project_location_df = pd.read_sql(query, engine)
    return project_location_df

def get_construction_company_total_area_df():
    query = """
        SELECT construction_company, SUM(total_area) AS total_area_sum
        FROM structure3.project
        GROUP BY construction_company
        ORDER BY total_area_sum
    """

    construction_company_total_area_df = pd.read_sql(query, engine)
    return construction_company_total_area_df

def get_map_coordinates_df():
    query = """
        SELECT sub_table.latitude, sub_table.longitude, SUM(count) AS sum 
        FROM 
            (SELECT latitude, longitude, COUNT(*) AS count 
            FROM structure3.location_coordinate AS loc 
            JOIN structure3.building AS bldg ON loc.project_id = bldg.project_id
            GROUP BY loc.project_id) AS sub_table
        GROUP BY sub_table.latitude, sub_table.longitude;
    """

    map_coordinates_df = pd.read_sql(query, engine)
    return map_coordinates_df

def get_map_table_df():
    query = """
        SELECT 
            subquery.min_val as min_val,
            subquery.max_val AS max_val,
            FLOOR((p.total_area - subquery.min_val) / subquery.interval_size) AS range_num,
            COUNT(*) AS item_count
        FROM
            (SELECT 
                MAX(total_area) AS max_val,
                MIN(total_area) AS min_val,
                (MAX(total_area) - MIN(total_area)) / 8 AS interval_size
            FROM
                structure3.project) AS subquery
        JOIN structure3.project AS p ON p.total_area >= subquery.min_val AND p.total_area <= subquery.max_val
        GROUP BY subquery.min_val, subquery.max_val, range_num
        ORDER BY range_num;
    """

    map_table_df = pd.read_sql(query, engine)
    return map_table_df