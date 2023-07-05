import React, { useEffect, useState } from "react";
import axios from "axios";
import urlPrefix from "../../resource/URL_prefix.json";
import { subBuildingTotalAnalysisTable2_interface } from "./../../interface/subBuildingTotalAnalysisTable2_interface";
import { subBuildingAnalysisPercantage_interface } from "../../interface/subBuildingAnalysisPercantage_interface";

import {
  Grid,
  GridColumn,
  GridDetailRow,
  GridToolbar,
  GridDetailRowProps,
  GridDataStateChangeEvent,
  GridExpandChangeEvent,
} from "@progress/kendo-react-grid";
import "./../../styles/subBuildingTotalAnalysisTable.scss";

const TotalAnalysisGrid2 = (props: any) => {
  const [selectedBuildingInfo, setSelectedBuildingInfo] =
    useState<subBuildingTotalAnalysisTable2_interface[]>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
        if (props.selectedSubBuildingId === 0) {
          response = await axios.get(
            urlPrefix.IP_port +
              "/sub_building/total_analysis_table2/" +
              props.selectedBuildingId
          );
        } else {
          response = await axios.get(
            urlPrefix.IP_port +
              "/sub_building/analysis_table2/" +
              props.selectedSubBuildingId
          );
        }

        setSelectedBuildingInfo(JSON.parse(response.data));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [props.selectedBuildingId, props.selectedSubBuildingId]);

  //7/4에 여기하고있었음
  useEffect(() => {
    if (selectedBuildingInfo !== undefined) {
      console.log(selectedBuildingInfo[0]);
      const newPercentageInfo = selectedBuildingInfo.map(
        (item) => item.con_percentage
      );

      console.log(newPercentageInfo);

      props.setPercentagesInfo(newPercentageInfo);
    }
  }, [props.selectedType]);

  return (
    <div>
      {selectedBuildingInfo && (
        <div className="table-container">
          <Grid data={selectedBuildingInfo}>
            <GridColumn
              title="구분"
              field="component_type"
              width={"100%"}
              headerClassName="custom-header-cell"
              className="custom-text-cell"
            />
            <GridColumn
              title="콘크리트(m³)"
              field="concrete_volume"
              width={"115%"}
              headerClassName="custom-header-cell"
              className="custom-number-cell"
            />
            <GridColumn
              title="콘크리트(%)"
              field="concrete_percentage"
              headerClassName="custom-header-cell"
              className="custom-number-cell"
            />
            <GridColumn
              title="거푸집(㎡)"
              field="formwork_area"
              headerClassName="custom-header-cell"
              className="custom-number-cell"
            />
            <GridColumn
              title="거푸집(%)"
              field="formwork_percentage"
              headerClassName="custom-header-cell"
              className="custom-number-cell"
            />
            <GridColumn
              title="철근(Ton)"
              field="rebar_weight"
              headerClassName="custom-header-cell"
              className="custom-number-cell"
            />
            <GridColumn
              title="철근(%)"
              field="rebar_percentage"
              headerClassName="custom-header-cell"
              className="custom-number-cell"
            />
          </Grid>
        </div>
      )}
    </div>
  );
};

export default TotalAnalysisGrid2;
