import React, { useState, useEffect } from "react";
import {
  Chart,
  ChartLegend,
  ChartTooltip,
  ChartSeries,
  ChartSeriesItem,
} from "@progress/kendo-react-charts";

import { subBuildingAnalysisValue_interface } from "../../interface/subBuildingAnalysisValue_interface";
import { Color } from "@progress/kendo-drawing";

const SubBuildingTotalAnalysisBarChart = (props:any) => {
    const [values, setValues] = useState<
    subBuildingAnalysisValue_interface[]
  >([]);
  const [returnDiv, setReturnDiv] = useState(<div></div>);

  useEffect(() => {
    setValues(props.valueInfo)
  }, [props.valueInfo]);

  useEffect(() => {
    console.log(values);
    setReturnDiv(
        <div>
        <Chart style={{width: "100%",height: "36vh"}}>
          {/* <ChartLegend position="top" orientation="horizontal" padding={-5} /> */}
  
          <ChartSeries>
            <ChartSeriesItem
              type="bar"
              data={values}
              categoryField="type"
              field="value"
              holeSize={40}
              size={45}
              color="#00028f"
            />
          </ChartSeries>
          {/* <ChartTooltip render={renderTooltip} /> */}
        </Chart>
      </div>
    );
  }, [values]);

  return returnDiv
};

export default SubBuildingTotalAnalysisBarChart;
