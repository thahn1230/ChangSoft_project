import React, { useEffect, useState } from "react";
import { SubBuildingTotalAnalysis2 } from "interface/SubBuildingInterface";

import {
  Grid,
  GridColumn,
} from "@progress/kendo-react-grid";


import { useSubBuildingInfo } from "hooks/useSubBuildingInfo"

import "styles/subBuildingTotalAnalysisTable.scss";

const TotalAnalysisGrid2 = (props: any) => {
  const [selectedSubBuildingId, setSelectedSubBuildingId] = useSubBuildingInfo()
  const [selectedBuildingInfo, setSelectedBuildingInfo] =
    useState<SubBuildingTotalAnalysis2[]>();

    //여긴 나는지 안나는지 모르겠
  useEffect(() => {
    if(selectedSubBuildingId===-1)
    return;
    let url;

    if (selectedSubBuildingId === 0) {
      url = `${process.env.REACT_APP_API_URL}/sub_building/total_analysis_table_all/2/${props.selectedBuildingId}`;
    } else {
      url = `${process.env.REACT_APP_API_URL}/sub_building/total_analysis_table/2/${selectedSubBuildingId}`;
    }

    fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((response) => {
        // const arrayData: ProjectsFloorCount[] = JSON.parse(data);
        // setTotalfloor(arrayData);
        setSelectedBuildingInfo(JSON.parse(response));
      })
      .catch((error) => console.error("Error:", error));
  }, [props.selectedBuildingId, selectedSubBuildingId]);

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
  }, [props.selectedType, selectedBuildingInfo]);

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
