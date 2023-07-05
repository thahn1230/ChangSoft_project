import React, { useState, useEffect } from "react";
import {
  Chart,
  ChartLegend,
  ChartTooltip,
  ChartSeries,
  ChartSeriesItem,
} from "@progress/kendo-react-charts";

import { subBuildingAnalysisPercantage_interface } from "../../interface/subBuildingAnalysisPercantage_interface";
const SubBuildingTotalAnalysisPieChart = (
  props:any
) => {
  const [percentages, setPercentages] = useState<
    subBuildingAnalysisPercantage_interface[]
  >([]);

  return (
    <div>
      {/* <Chart style={{ height: "36vh" }}>
        <ChartLegend position="top" orientation="horizontal" padding={-5}/>

        <ChartSeries>
          <ChartSeriesItem
            type="donut"
            data={percentages}
            categoryField="field"
            field="percentage"
            autoFit={true}
            holeSize={40}
            size={45}
          />
        </ChartSeries>
        <ChartTooltip render={renderTooltip} />
      </Chart> */}
    </div>
  );
};

export default SubBuildingTotalAnalysisPieChart;
