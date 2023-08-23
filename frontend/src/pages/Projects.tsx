import BuildingList from "../component/projectComponent/buildingList";
import React, { useEffect, useState } from "react";
import ProjectDetail from "../component/projectComponent/projectDetail";
import ProjectList from "./../component/projectComponent/projectList";
import { projectList_interface } from "./../interface/projectList_interface";
import { buildingInfo_interface } from "./../interface/buildingInfo_interface";
import tempImage from "./../resource/temp.jpg"

const Projects = (props: any) => {
  const [selectedProjectName, setSelectedProjectName] = useState<string>(
    "project를 선택해주세요"
  );
  const [data, setData] = useState<projectList_interface[]>([]);
  const [buildingInfo, setBuildingInfo] = useState<
    buildingInfo_interface | undefined
  >();

  useEffect(() => {
    props.setBuildingInfo(buildingInfo);
  }, [buildingInfo]);
  useEffect(() => {
    props.setProjectName(selectedProjectName);
  }, [selectedProjectName]);

  return (
    <div className="projects">
       <q>
        이 DB는 현재 Demo의 목적으로 공개되고 있습니다. DB에 나타나는 건설사나 프로젝트는 가공된 데이터로 실제의 건설사나, 프로젝트와는 관련이 없습니다.
      </q>
      <ProjectList
        setData={setData}
        setSelectedProjectName={setSelectedProjectName}
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
              (data: any) => data.project_name === selectedProjectName
            )}
          />
        </div>
      </div>

      <div className="projects">
        <BuildingList
          projectName={selectedProjectName}
          projectList={data}
          setBuildingInfo={setBuildingInfo}
        />
      </div>
    </div>
  );
};

export default Projects;
