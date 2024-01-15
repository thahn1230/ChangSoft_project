import apiService from "services/apiService";

const getMarkerData = async () => {
  const response = await apiService.get("project/map", true);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const markerData = await response.json();
  return markerData;
};

const getFloorCount = async () => {
  const response = await apiService.get(
    "building/floor_count_histogram",
    true
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  const floorCount = JSON.parse(data);
  return floorCount;
};

const getConstructionCompanyRatio = async () => {
  const response = await apiService.get(
    "project/construction_company_ratio",
    true
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  const arrayData = JSON.parse(data);
  const top5 = arrayData.slice(0, 5);

  const othersPercentage = arrayData
    .slice(5)
    .reduce((acc: number, curr: any) => acc + curr.percentage, 0);
  const othersData = { field: "Others", percentage: othersPercentage };

  const modifiedData = [...top5, othersData];

  return modifiedData;
};

const getLocalRatio = async () => {
  const response = await apiService.get(
    "project/location_ratio",
    true
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  const arrayData = JSON.parse(data);
  const top5 = arrayData.slice(0, 5);

  const othersPercentage = arrayData
    .slice(5)
    .reduce((acc: number, curr: any) => acc + curr.percentage, 0);
  const othersData = { field: "Others", percentage: othersPercentage };

  const modifiedData = [...top5, othersData];

  return modifiedData;
};

const getUsageRatio = async () => {
  const response = await apiService.get("project/usage_ratio", true);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  const arrayData = JSON.parse(data);
  const top5 = arrayData.slice(0, 5);

  const othersPercentage = arrayData
    .slice(5)
    .reduce((acc: number, curr: any) => acc + curr.percentage, 0);
  const othersData = { field: "Others", percentage: othersPercentage };

  const modifiedData = [...top5, othersData];

  return modifiedData;
};

const getProjectNumber = async () => {
  const response = await apiService.get("project/count", true);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  const projectNumData = JSON.parse(data);
  return projectNumData;
};
const getBuildingNumber = async () => {
  const response = await apiService.get("building/count", true);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  const buildingNumData = JSON.parse(data);
  return buildingNumData;
};

const getProjectArea = async () => {
  const response = await apiService.get(
    "project/total_area_histogram",
    true
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  const projectAreaData = JSON.parse(data);
  return projectAreaData;
};

export {
  getConstructionCompanyRatio,
  getMarkerData,
  getFloorCount,
  getLocalRatio,
  getBuildingNumber,
  getProjectArea,
  getProjectNumber,
  getUsageRatio,
};
