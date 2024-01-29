from ..database import Database

import pandas as pd

engine = Database().get_engine()

# 파라미터 바인딩 꼭 하기

def get_project_building_df(building_id: int):
    query = f"""
        SELECT project.project_name, building.building_name 
        FROM project JOIN building 
        ON project.id = building.project_id 
        WHERE building.id = %(building_id)s;
    """
        
    params = {'building_id': building_id}
    project_building_df = pd.read_sql(query, engine, params=params)
    return project_building_df

def get_sub_building_names_df():
    query = """
        SELECT building.*, 
        ((total_area) / 1000000) AS total_area_square_meter,
        (stories_above + stories_below) AS total_stories, 
        ((height_above + height_below)/ 1000) AS total_height,
        CONCAT(stories_above, ' / ', stories_below) AS stories_above_below,
        (height_above / 1000) AS height_above_meter,
        (height_below / 1000) AS height_below_meter,
        CONCAT(FORMAT(ROUND(height_above / 1000, 2), 2), ' / ', 
        FORMAT(ROUND(height_below / 1000, 2), 2)) AS height_above_below,
        GROUP_CONCAT(sub_building.sub_building_name SEPARATOR ', ') AS sub_bldg_list
        FROM building 
        JOIN sub_building ON building.id = sub_building.building_id
        GROUP BY building.id
    """

    sub_building_names_df = pd.read_sql(query, engine)
    return sub_building_names_df

def get_floor_count_table_df():
    query = """
        SELECT 
            FLOOR((floor_count) / 10) AS range_num,
            COUNT(*) AS item_count
        FROM
            (SELECT building_name, COUNT(*) AS floor_count 
            FROM structure3.floor AS floor 
            JOIN structure3.building AS building ON building.id = floor.building_id
            GROUP BY building_name) AS subquery
        GROUP BY range_num
        ORDER BY range_num;
    """

    floor_count_table_df = pd.read_sql(query, engine)
    return floor_count_table_df