from app.models.models import LatLngWithSum, FieldRatio, HistogramList
from app.schemas.base_schema import ResponseModel
from datetime import datetime

from typing import List

class TableCountResponse(ResponseModel):
    table_count: int

class ProjectMapResponse(ResponseModel):
    map_data: List[LatLngWithSum]

class FieldRatioResponse(ResponseModel):
    # for construction company and location ratio
    data: List[FieldRatio]

class TotalAreaHistogramResponse(ResponseModel):
    data: List[HistogramList]

class ProjectDetailResponse(ResponseModel):
    project_name: str
    building_area: float
    construction_company: str
    location: str
    total_area: float
    construction_start: datetime | None
    construction_end: datetime | None
    total_date: int | None
    building_count: int

