import BuildingList from "../component/projectComponent/buildingList";
import React, { useEffect, useState } from "react";
import ProjectDetail from "../component/projectComponent/projectDetail";
import ProjectList from "./../component/projectComponent/projectList";
import { projectList_interface } from "./../interface/projectList_interface";
import { buildingInfo_interface } from "./../interface/buildingInfo_interface";

const Projects = (props:any) => {
  const [selectedProjectName, setSelectedProjectName] =
    useState<string>("project를 선택해주세요");
  const [data, setData] = useState<projectList_interface[]>([]);
  const [buildingInfo, setBuildingInfo] = useState<
    buildingInfo_interface | undefined
  >();

  
  useEffect(() => {
    props.setBuildingInfo(buildingInfo)
  }, [buildingInfo]);
  

  return (
    <div className="projects">
      <ProjectList
        setData={setData}
        setSelectedProjectName={setSelectedProjectName}
      />

      <div className="projectDetail">
        <img
          style={{ width: "49%", float: "left", paddingLeft: "1%" }}
          alt="프로젝트 사진"
        />
        <div style={{ width: "49%", float: "right", paddingLeft: "1%" }}>
          <ProjectDetail
            selectedProject={data.find(
              (data: any) => data.project_name === selectedProjectName
            )}
          />
        </div>
      </div>

      <div className="projects">
        <BuildingList projectName={selectedProjectName} projectList={data} setBuildingInfo = {setBuildingInfo}/>
      </div>
    </div>
  );
};

export default Projects;
