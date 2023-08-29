import React from "react";
import SubBuildingTabLayout from "component/SubBuildingTabLayout";

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
