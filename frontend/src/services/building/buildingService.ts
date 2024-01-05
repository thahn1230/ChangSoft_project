import apiService from "services/apiService";

const getImagePath = async (buildingId:Number) => {
  const response = await apiService.get(
    `building/${buildingId}/get_project_name`,
    true
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const responseJson = await response.json();
  const data = JSON.parse(responseJson);
  const importedImagePath = await import(
    `resource/project_pictures/${data[0].project_name}/${data[0].building_name}/ScreenShot.png`
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
    
      const responseJson = await response.json();
      const detailedBuildingList = JSON.parse(responseJson);

      return detailedBuildingList
}

export { getImagePath,getDetailedBuildingList };
