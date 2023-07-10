import React, { useState, useEffect } from "react";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import SubBuildingList from "./subBuildingList";

import axios from "axios";
import urlPrefix from "../../../resource/URL_prefix.json";
import SubBuildingConcreteAnalysisTable from "./subBuildingAnalysisTable";

import { subBuildingInfo_interface } from "../../../interface/subBuildingInfo_interface";

const AnalysisTab = (props: any) => {
  const [selectedSubBuildingId, setSelectedSubBuildingId] = useState(0);

  const [subBuildingInfo, setSubBuildingInfo] = useState<
    subBuildingInfo_interface[]
  >([]);

  let headerData = [
    {
      projectName: props.projectName,
      building_name: props.buildingInfo?.building_name,
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          urlPrefix.IP_port + "/sub_building/" + props.buildingInfo.id
        );

        const subBuildings = JSON.parse(response.data);
        setSubBuildingInfo(subBuildings);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [props.buildingInfo]);

  return (
    <div>
      <Grid data={headerData}>
        <GridColumn
          title="프로젝트명"
          field="projectName"
          headerClassName="custom-header-cell"
          className="custom-text-cell"
        />
        <GridColumn
          title="빌딩명"
          field="building_name"
          headerClassName="custom-header-cell"
          className="custom-text-cell"
        />

        <GridColumn
          title="건물명 구분"
          cell={() => (
            <div>
              <SubBuildingList
                buildingInfo={props.buildingInfo}
                projectName={props.projectName}
                setSelectedSubBuildingId={setSelectedSubBuildingId}

                selectedSubBuildingId={selectedSubBuildingId}
                selectedSubBuildingName={
                  props.selectedSubBuildingInfo?.sub_building_name
                }
                subBuildingInfo={subBuildingInfo}
              />
            </div>
          )}
          headerClassName="custom-header-cell"
          className="custom-text-cell"
        />
      </Grid>

      <SubBuildingList
        buildingInfo={props.buildingInfo}
        projectName={props.projectName}
        setSelectedSubBuildingId={setSelectedSubBuildingId}
      ></SubBuildingList>
      <SubBuildingConcreteAnalysisTable
        buildingInfo={props.buildingInfo}
        projectName={props.projectName}
        selectedSubBuildingId={selectedSubBuildingId}
      ></SubBuildingConcreteAnalysisTable>
    </div>
  );
};

export default AnalysisTab;
