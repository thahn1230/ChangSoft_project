import apiService from "services/apiService";

const getImagePath = async (buildingId:Number) => {
  const response = await apiService.get(
    `building/${buildingId}/get_project_name`,
    true
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();

  const importedImagePath = await import(
    `resource/project_pictures/${data.project_name}/${data.building_name}/ScreenShot.png`
  );

  return importedImagePath.default;
};

const getDetailedBuildingList = async ()=>{
    const response = await apiService.get(
        "building/additional_sub_info",
        true
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
    
      const detailedBuildingList = (await response.json()).data;

      return detailedBuildingList
}

export { getImagePath,getDetailedBuildingList };
