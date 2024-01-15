from sqlalchemy import text

from ..database import engine

import pandas as pd

# 파라미터 바인딩

def get_project_detail_df(db, project_id: int):
    query = f"""
        SELECT p.project_name, p.building_area, p.construction_company, 
        p.location, p.total_area, p.construction_start, p.construction_end,
        (p.construction_end-p.construction_start) AS total_date,
        COUNT(*) AS building_count
        FROM structure3.project AS p
        JOIN structure3.building AS b ON p.id = b.project_id
        WHERE p.id = %(project_id)s;
    """

    params = {'project_id': project_id}
    project_detail_df = pd.read_sql(query, engine, params=params)

    return project_detail_df