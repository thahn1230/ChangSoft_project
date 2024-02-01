from app.models.models import LatLngWithSum
from app.schemas.base_schema import ResponseModel

from typing import List

class TableCountResponse(ResponseModel):
    table_count: int

class ProjectMapResponse(ResponseModel):
    map_data: List[LatLngWithSum]