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
import axios from "axios";
import urlPrefix from "../../../resource/URL_prefix.json";

import SubBuildingConcreteAnalysisTable from "./subBuildingAnalysisTable";

const AnalysisTab = (props: any) => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        /*
        const response = await axios.get(
          urlPrefix.IP_port +
            "/sub_building/analysis_table/" +
            "subbildingID" +
            "/concrete"
        );
        const data = JSON.parse(response.data); // assuming the API response contains an array of buildings
        */
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [props]);

  return (
    <div>
      <SubBuildingConcreteAnalysisTable
        buildingInfo={props.buildingInfo}
        projectName={props.projectName}
      ></SubBuildingConcreteAnalysisTable>
    </div>
  );
};

export default AnalysisTab;
