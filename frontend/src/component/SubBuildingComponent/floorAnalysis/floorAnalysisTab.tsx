import React from "react";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import SubBuildingFloorAnalysisTable from "./subBuildingFloorAnalysisTable";

const FloorAnalysisTab = (props: any) => {
  let headerData = [
    {
      projectName: props.projectName,
      building_name: props.buildingInfo?.building_name,
    },
  ];
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
      </Grid>
      <SubBuildingFloorAnalysisTable
        buildingInfo={props.buildingInfo}
        projectName={props.projectName}
      ></SubBuildingFloorAnalysisTable>
    </div>
  );
};

export default FloorAnalysisTab;
