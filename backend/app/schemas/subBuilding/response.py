from app.models.models import SubBuildingData, ComponentType
from app.schemas.base_schema import ResponseModel

from typing import List

class SubBuildingDataResponse(ResponseModel):
    data: List[SubBuildingData]

class ComponentTypeResponse(ResponseModel):
    data: List[ComponentType]