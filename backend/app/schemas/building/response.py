from app.models.models import RangeItemCount, AdditionalSubInfo
from app.schemas.base_schema import ResponseModel
from typing import List

class FloorCountResponse(ResponseModel):
    data: List[RangeItemCount]

class ProjectNameResponse(ResponseModel):
    project_name: str
    building_name: str

class AdditionalSubInfoResponse(ResponseModel):
    data: List[AdditionalSubInfo]