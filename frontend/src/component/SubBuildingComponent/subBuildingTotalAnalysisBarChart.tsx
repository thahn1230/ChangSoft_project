import React, { useState, useEffect } from "react";
import {
  Chart,
  ChartCategoryAxis,
  ChartCategoryAxisItem,
  ChartCategoryAxisTitle,
  ChartValueAxis,
  ChartValueAxisItem,
  ChartSeries,
  ChartSeriesItem,
  ChartTooltip,
} from "@progress/kendo-react-charts";

import { subBuildingAnalysisValue_interface } from "../../interface/subBuildingAnalysisValue_interface";
import { Color } from "@progress/kendo-drawing";

const SubBuildingTotalAnalysisBarChart = (props: any) => {
  const [values, setValues] = useState<subBuildingAnalysisValue_interface[]>(
    []
  );
  const [returnDiv, setReturnDiv] = useState(<div></div>);
  const [unit, setUnit] = useState<string>("");

  useEffect(() => {
    switch (props.selectedType) {
      case "concrete":
        setUnit("m³")
        break;
      case "formwork":
        setUnit("㎡")
        break;
      case "rebar":
        setUnit("Ton")
        break;
    }
  }, [props.selectedType]);

  useEffect(() => {
    setValues(props.valueInfo);
  }, [props.valueInfo]);

  useEffect(() => {
    setReturnDiv(
      <div style={{ height: "40vh" }}>
        <Chart style={{ width: "100%", height: "100%" }}>
          <ChartSeries>
            <ChartSeriesItem
              type="bar"
              data={values}
              categoryField="type"
              field="value"
              holeSize={40}
              size={45}
              color="#00028f"
            ></ChartSeriesItem>
          </ChartSeries>
          <ChartValueAxis>
            <ChartValueAxisItem title={{ text: "Floor Count(" + unit + ")" }} />
          </ChartValueAxis>
          <ChartTooltip render={renderTooltip} />
        </Chart>
      </div>
    );
  }, [values]);

  const renderTooltip = (e: any) => {
    if (e && e.point) {
      return (
        <div>
          <p>Type: {e.point.dataItem.type}</p>
          <p>Value: {e.point.dataItem.value.toFixed(2) + unit}</p>
        </div>
      );
    }
    return null;
  };

  return returnDiv;
};

export default SubBuildingTotalAnalysisBarChart;
