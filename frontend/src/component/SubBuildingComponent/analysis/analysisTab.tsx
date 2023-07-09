import React, { useState, useEffect } from "react";
import SubBuildingList from "./subBuildingList";
import axios from "axios";
import urlPrefix from "../../../resource/URL_prefix.json";

import SubBuildingConcreteAnalysisTable from "./subBuildingAnalysisTable";

const AnalysisTab = (props: any) => {
  const [selectedSubBuildingId, setSelectedSubBuildingId] = useState(0);


  return (
    <div>
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
