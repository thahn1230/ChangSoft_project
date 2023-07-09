import React, { useState, useEffect } from "react";

import SubBuildingFloorAnalysisTable from "./subBuildingFloorAnalysisTable";

const FloorAnalysisTab = (props: any) => {
  return (
    <div>
      <SubBuildingFloorAnalysisTable
        buildingInfo={props.buildingInfo}
        projectName={props.projectName}
      ></SubBuildingFloorAnalysisTable>
    </div>
  );
};

export default FloorAnalysisTab;
