import React, { useState, useEffect } from "react";
import {
  Grid,
  GridColumn,
  getSelectedState,
  getSelectedStateFromKeyDown,
  GridFilterChangeEvent,
} from "@progress/kendo-react-grid";
import {
  RadioButton,
  RadioButtonChangeEvent,
} from "@progress/kendo-react-inputs";
import SubBuildingList from "./subBuildingList";
import axios from "axios";
import urlPrefix from "../../../resource/URL_prefix.json";

import SubBuildingConcreteAnalysisTable from "./subBuildingAnalysisTable";

const AnalysisTab = (props: any) => {
  const [selectedSubBuildingId, setSelectedSubBuildingId] = useState(0);

  useEffect(() => {
    console.log(props.buildingInfo)
  }, [props]);

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
