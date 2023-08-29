import React, { useEffect, useState } from "react";
import BuildingList from "component/projectComponent/BuildingList";
import ProjectDetail from "component/projectComponent/ProjectDetail";
import ProjectList from "component/projectComponent/ProjectList";
import { projectList_interface } from "interface/projectList_interface";
import { buildingInfo_interface } from "interface/buildingInfo_interface";

//context
import {useProjectName, useBuildingInfo} from "App"

const Projects = (props: any) => {
  //const [, setBuildingInfo] = useBuildingInfo();
  const [projectName, setProjectName] = useProjectName();
  const [data, setData] = useState<projectList_interface[]>([]);

  return (
    <div className="projects">
      <ProjectList
        setData={setData}
      />

      <div className="projectDetail">
        <img
          src={
            "http://pcae.g2b.go.kr:8044/cmn/cmn0010/bevImage.sjson?untyAtchFileNo=8VcGkyP5jybg&atchFileSno=0&ttalBizNo=2022120011"
          }
          style={{ width: "49%", float: "left", paddingLeft: "1%" }}
          alt="프로젝트 사진"
        />
        <div style={{ width: "49%", float: "right", paddingLeft: "1%" }}>
          <ProjectDetail
            selectedProject={data.find(
              (data: any) => data.project_name === projectName
            )}
          />
        </div>
      </div>

      <div className="projects">
        <BuildingList
          projectList={data}
        />
      </div>
    </div>
  );
};

export default Projects;
