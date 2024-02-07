from typing import Tuple
from pydantic import BaseModel
from datetime import datetime

import pandas as pd

# project
class LatLngWithSum(BaseModel):  # BaseModel을 상속받아 정의
    latlng: Tuple[float, float]  # latlng 필드 타입을 Tuple로 변경
    sum: int

class FieldRatio(BaseModel):
    field: str
    count: int
    percentage: float

class HistogramList(BaseModel):
    min_val: float
    max_val: float
    range_num: float
    item_count: int

# building
class RangeItemCount(BaseModel):
    range_num: float
    item_count: int

class AdditionalSubInfo(BaseModel):
    id: int
    building_name: str
    screenshot: str | None
    total_area: float
    construction_method: str
    structure_type: str
    top_down: str
    plane_shape: str
    foundation_type: str
    structure_code: str
    performance_design_target: str
    project_id: int
    created: datetime
    updated: datetime
    stories_above: int
    stories_below: int
    height_above: float
    height_below: float
    total_area_square_meter: float
    total_stories: int
    total_height: float
    stories_above_below: str
    height_above_meter: float
    height_below_meter: float
    height_above_below: str
    sub_bldg_list: str

# subBuilding
class SubBuildingData(BaseModel):
    id: int
    sub_building_type: str
    sub_building_category: str 
    sub_building_name: str
    total_area_above: float | None
    total_area_below: float | None
    building_id: int

class ComponentType(BaseModel):
    component_type: str