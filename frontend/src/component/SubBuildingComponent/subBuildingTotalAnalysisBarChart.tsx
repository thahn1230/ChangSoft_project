import React, { useState, useEffect } from "react";
import {
  Chart,
  ChartCategoryAxis,
  ChartCategoryAxisItem,
  ChartCategoryAxisTitle,
  ChartSeries,
  ChartSeriesItem,
} from "@progress/kendo-react-charts";

import { subBuildingAnalysisValue_interface } from "../../interface/subBuildingAnalysisValue_interface";

const SubBuildingTotalAnalysisBarChart = (props: any) => {
  const [values, setValues] = useState<subBuildingAnalysisValue_interface[]>(
    []
  );
  const [returnDiv, setReturnDiv] = useState(<div></div>);

  useEffect(() => {
    setValues(props.valueInfo);
  }, [props.valueInfo]);

  useEffect(() => {
    console.log(values);
    setReturnDiv(
      <div>
        chartstart
        <Chart style={{ height: "36vh", width: "50vh" }}>
          {/* <ChartLegend position="top" orientation="horizontal" padding={-5} /> */}
          

          <ChartSeries>
            <ChartSeriesItem
              type="bar"
              data={values}
              categoryField="type"
              field="value"
              holeSize={40}
              size={45}
            />
          </ChartSeries>
          {/* <ChartTooltip render={renderTooltip} /> */}
        </Chart>
        chartend
      </div>
    );
  }, [values]);

  return returnDiv;
};

export default SubBuildingTotalAnalysisBarChart;
