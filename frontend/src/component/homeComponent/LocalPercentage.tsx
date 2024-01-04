import { useState, useEffect } from "react";
import {
  Chart,
  ChartLegend,
  ChartSeries,
  ChartSeriesItem,
  ChartTooltip,
} from "@progress/kendo-react-charts";
import styled from "styled-components";
import { getLocalRatio } from "services/dashboard/dashboardService";

interface PercentageInterface {
  field: string;
  count: number;
  percentage: number;
}

const ChartWrapper = styled.div`
  @import url("https://fonts.googleapis.com/css2?family=Inter&display=swap");

  .k-chart {
    font-family: "Inter", sans-serif !important;
    font-size: 20px !important;
  }

  .k-chart-legend {
    white-space: normal;
  }
  .k-chart {
    height: 36vh;
  }
`;

const LocalPercentage = () => {
  const [percentages, setPercentages] = useState<PercentageInterface[]>([]);
  useEffect(() => {
    getLocalRatio()
      .then((localPercentageData) => {
        setPercentages(localPercentageData);
      })
      .catch((error) => {});
  }, []);

  const renderTooltip = (e: any) => {
    if (e && e.point) {
      if (e.point.category === null) {
        return (
          <div>
            <p>Category: NULL</p>
            <p>Percentage: {Number(e.point.dataItem.percentage).toFixed(2)}%</p>
          </div>
        );
      }
      return (
        <div>
          <p>Category: {e.point.category}</p>
          <p>Percentage: {Number(e.point.dataItem.percentage).toFixed(2)}%</p>
        </div>
      );
    }

    return null;
  };

  return (
    <ChartWrapper>
      <Chart>
        <ChartLegend position="top" />

        <ChartSeries>
          <ChartSeriesItem
            type="donut"
            data={percentages}
            categoryField="field"
            field="percentage"
            autoFit={true}
            holeSize={40}
            size={45}
            color={"blue"}
          />
        </ChartSeries>
        <ChartTooltip render={renderTooltip} />
      </Chart>
    </ChartWrapper>
  );
};

export default LocalPercentage;
