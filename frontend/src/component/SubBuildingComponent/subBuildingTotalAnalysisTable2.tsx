import React, { useEffect, useState } from "react";
import axios from "axios";
import urlPrefix from "../../resource/URL_prefix.json";
import { subBuildingTotalAnalysisTable2_interface } from "./../../interface/subBuildingTotalAnalysisTable2_interface";
import { subBuildingAnalysisPercentage_interface } from "../../interface/subBuildingAnalysisPercentage_interface";

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
              "/sub_building/total_analysis_table_all/2/" +
              props.selectedBuildingId
          );
        } else {
          response = await axios.get(
            urlPrefix.IP_port +
              "/sub_building/total_analysis_table/2/" +
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

  useEffect(() => {
    if (
      props.selectedType !== undefined &&
      selectedBuildingInfo !== undefined
    ) {
      switch (props.selectedType) {
        case "concrete":
          props.setPercentagesInfo(
            selectedBuildingInfo.map((item) => ({
              type: item.component_type,
              percentage: item.concrete_percentage,
            }))
          );
          props.setValueInfo(
            selectedBuildingInfo.map((item) => ({
              type: item.component_type,
              value: item.concrete_volume,
            }))
          );
          break;

        case "formwork":
          props.setPercentagesInfo(
            selectedBuildingInfo.map((item) => ({
              type: item.component_type,
              percentage: item.formwork_percentage,
            }))
          );
          props.setValueInfo(
            selectedBuildingInfo.map((item) => ({
              type: item.component_type,
              value: item.formwork_area,
            }))
          );
          break;

        case "rebar":
          props.setPercentagesInfo(
            selectedBuildingInfo.map((item) => ({
              type: item.component_type,
              percentage: item.rebar_percentage,
            }))
          );
          props.setValueInfo(
            selectedBuildingInfo.map((item) => ({
              type: item.component_type,
              value: item.rebar_weight,
            }))
          );
          break;
      }
    }

  }, [props.selectedType , selectedBuildingInfo]);

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
              format={"{0:n2}"}
            />
            <GridColumn
              title="콘크리트(%)"
              field="concrete_percentage"
              headerClassName="custom-header-cell"
              className="custom-number-cell"
              format={"{0:n2}"}
            />
            <GridColumn
              title="거푸집(㎡)"
              field="formwork_area"
              headerClassName="custom-header-cell"
              className="custom-number-cell"
              format={"{0:n2}"}
            />
            <GridColumn
              title="거푸집(%)"
              field="formwork_percentage"
              headerClassName="custom-header-cell"
              className="custom-number-cell"
              format={"{0:n2}"}
            />
            <GridColumn
              title="철근(Ton)"
              field="rebar_weight"
              headerClassName="custom-header-cell"
              className="custom-number-cell"
              format={"{0:n2}"}
            />
            <GridColumn
              title="철근(%)"
              field="rebar_percentage"
              headerClassName="custom-header-cell"
              className="custom-number-cell"
              format={"{0:n2}"}
            />
          </Grid>
        </div>
      )}
    </div>
  );
};

export default TotalAnalysisGrid2;
