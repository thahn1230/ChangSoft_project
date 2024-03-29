import apiService from "services/apiService";

const getProjectData = async (selectedProjectId:number) => {
  const response = await apiService.get(
    `project/${selectedProjectId}/project_detail`,
    true
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const projectData = [await response.json()];

  return projectData;
};

const getDetailedProjectData = async ()=>{
    const response = await apiService.get(
        "project/",
        true
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
    
      const rawData = await response.json();
      const detailedProjectData = JSON.parse(rawData);
    
      return detailedProjectData;
}


export {getProjectData,getDetailedProjectData}