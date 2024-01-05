import apiService from "services/apiService";
import { SubBuildingInfo } from "interface/SubBuildingInterface";

const getSubBuildingInfo = async (buildingId:number) => {
  const response = await apiService.get(`sub_building/${buildingId}`, true);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const rawData = await response.json();
  const subBuildingInfo:SubBuildingInfo[] = JSON.parse(rawData);

  return subBuildingInfo;
};

const getComponentTypeListFromBuildingId= async (buildingId:number) =>{
    const response = await apiService.get(`sub_building/floor_analysis_table/${buildingId}/component_type`, true);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
  
    const rawData = await response.json();
    const data = JSON.parse(rawData);
    let idx = 0
    const componentTypeList = [{ componentType: "All", id: idx++, checked: false }].concat(
        data.map((item:any) => {
          return {
            componentType: item.component_type,
            id: idx++,
            checked: false,
          };
        })
      )
  
    return componentTypeList;
}

const fetchBuildingAnalysisData = async (buildingId:number, selectedSubBuildingId:number) => {
  const basePath = `sub_building/analysis_table${
    selectedSubBuildingId === 0 ? "_all" : ""
  }/${buildingId}`;

  const fetchAnalysisData = async (type:string) => {
    const response = await apiService.get(`${basePath}/${type}`, true);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const rawData = await response.json();
    return JSON.parse(rawData);
  };

  const concretePivotResponse = await fetchAnalysisData("concrete");
  const formworkPivotResponse = await fetchAnalysisData("formwork");
  const rebarResponse = await fetchAnalysisData("rebar");

  return [concretePivotResponse, formworkPivotResponse, rebarResponse];
};

const fetchSubBuildingFloorAnalysisData = async (buildingId:number, params: Record<string, string> | URLSearchParams) => {
  const fetchAnalysisData = async (type:string) => {
    const relativeUrlPath = `sub_building/floor_analysis_table/${buildingId}/${type}/filter`;

    // URLSearchParams 객체를 사용하여 쿼리 파라미터를 설정합니다.
    const queryParams = new URLSearchParams(params);
    const queryString = queryParams.toString();
    const response = await apiService.get(`${relativeUrlPath}?${queryString}`, true);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const rawData = await response.json();
    return JSON.parse(rawData);
  };

  const concreteFloorGridResponse = await fetchAnalysisData("concrete");
  const formworkFloorGridResponse = await fetchAnalysisData("formwork");
  const rebarFloorGridResponse = await fetchAnalysisData("rebar");

  return [
    concreteFloorGridResponse,
    formworkFloorGridResponse,
    rebarFloorGridResponse,
  ];
};
export {
  getSubBuildingInfo,
  fetchBuildingAnalysisData,
  fetchSubBuildingFloorAnalysisData,
  getComponentTypeListFromBuildingId,
};
