import React, { useState, useEffect } from "react";
import {
  Chart,
  ChartTooltip,
  ChartSeries,
  ChartSeriesItem,
} from "@progress/kendo-react-charts";

import { SubBuildingAnalysisPercentage } from "interface/SubBuildingInterface";

const SubBuildingTotalAnalysisPieChart = (props: any) => {
  const [percentages, setPercentages] = useState<
  SubBuildingAnalysisPercentage[]
  >([]);
  const [returnDiv, setReturnDiv] = useState(<div></div>);

  useEffect(() => {
    setPercentages(props.percentagesInfo);
  }, [props.percentagesInfo]);

  useEffect(() => {
    setReturnDiv(
      <div>
        <Chart style={{ height: "36vh" }}>
          {/* <ChartLegend position="top" orientation="horizontal" padding={-5} /> */}

          <ChartSeries>
            <ChartSeriesItem
              type="donut"
              data={percentages}
              categoryField="type"
              field="percentage"
              holeSize={40}
              size={45}
            />
          </ChartSeries>
          <ChartTooltip render={renderTooltip} />
        </Chart>
      </div>
    );
  }, [percentages]);

  const renderTooltip = (e: any) => {
    if (e && e.point) {
      return (
        <div>
          <p>Type: {e.point.dataItem.type}</p>
          <p>Percentage: {Number(e.point.dataItem.percentage).toFixed(2)}%</p>
        </div>
      );
    }
    return null;
  };

  return returnDiv;
};

export default SubBuildingTotalAnalysisPieChart;
