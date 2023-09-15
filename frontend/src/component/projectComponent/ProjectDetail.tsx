import React, { useState, useEffect } from "react";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import urlPrefix from "resource/URL_prefix.json";
import { projectList_interface } from "interface/projectList_interface";
import "styles/GridDetail.scss";

interface projectDetail_interface {
  project_name: string;
  building_area: number;
  construction_company: string;
  location: string;
  total_area: number;
  construction_start: string;
  construction_end: string;
  total_date: string;
  building_count: number;
}

const ProjectDetail = (props: {selectedProject : projectList_interface | undefined}) => {
  const [projectData, setProjectData] = useState<projectDetail_interface[]>();

  useEffect(() => {
    if (props.selectedProject) {
      fetch(
        urlPrefix.IP_port +
          "/project/" +
          props.selectedProject.id +
          "/project_detail",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((response) => {
          const data = JSON.parse(response);
          setProjectData(data);
        })
        .catch((error) => console.error("Error:", error));
    }
  }, [props]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       if (props.selectedProject) {
  //         const response = await axios.get(
  //           urlPrefix.IP_port +
  //             "/project/" +
  //             props.selectedProject.id +
  //             "/project_detail"
  //         );

  //         const data = JSON.parse(response.data);
  //         setProjectData(data);
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   fetchData();
  // }, [props]);

  const headerClassName = "custom-header-cell";

  return (
    <div>
      <Grid data={projectData} style={{ width: "96.5%" }}>
        <GridColumn
          field="project_name"
          title="프로젝트명"
          headerClassName={headerClassName}
        />
        <GridColumn
          field="building_count"
          title="프로젝트 내 빌딩수"
          headerClassName={headerClassName}
          className="custom-number-cell"
        />
      </Grid>

      <Grid data={projectData} style={{ width: "96.5%" }}>
        <GridColumn
          field="building_area"
          title="건축면적(㎡)"
          headerClassName={headerClassName}
          className="custom-number-cell"
          format={"{0:n2}"}
        />
        <GridColumn
          field="construction_company"
          title="건설회사"
          headerClassName={headerClassName}
        />
        <GridColumn
          field="location"
          title="지역"
          headerClassName={headerClassName}
        />
        <GridColumn
          field="total_area"
          title="문서상 연면적(㎡)"
          headerClassName={headerClassName}
          className="custom-number-cell"
          format={"{0:n2}"}
        />
      </Grid>

      <Grid data={projectData} style={{ width: "96.5%" }}>
        <GridColumn title="프로젝트 기간" headerClassName={headerClassName}>
          <GridColumn
            field="construction_start"
            title="시작일"
            headerClassName={headerClassName}
          />
          <GridColumn
            field="construction_end"
            title="종료일"
            headerClassName={headerClassName}
          />
          <GridColumn
            field="total_date"
            title="소요일"
            headerClassName={headerClassName}
          />
        </GridColumn>
      </Grid>
    </div>
  );
};

export default ProjectDetail;
