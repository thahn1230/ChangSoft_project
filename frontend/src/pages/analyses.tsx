import React, { useState, useEffect } from "react";
import { Button } from "@progress/kendo-react-buttons";
import SubBuildingTabLayout from "./../component/subBuildingTabLayout";

const Analyses = (props:any) => {
  return (
    <div>
      <SubBuildingTabLayout
      buildingInfo={props.buildingInfo}
      projectName={props.projectName}>
      </SubBuildingTabLayout>
    </div>
  );
};

export default Analyses;
