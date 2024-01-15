import React, { useState, useEffect } from "react";
import {
  Chart,
  ChartSeries,
  ChartValueAxisItem,
  ChartSeriesItem,
  ChartValueAxis,
  ChartCategoryAxis,
  ChartCategoryAxisTitle,
  ChartCategoryAxisItem,
} from "@progress/kendo-react-charts";
import "hammerjs";

import styled from "styled-components";
import { getProjectArea } from "services/dashboard/dashboardService";

interface projectsTotalArea {
  min_val: number;
  max_val: number;
  range_num: number;
  item_count: number;
}

const TotalWrapper = styled.div`
  .k-chart {
    height: 36vh;
  }
`;

const categoryContent = (e: any) => {
  return (
    "&nbsp;&nbsp;&nbsp;" + (e.range_num * 25000).toString()
    // "&nbsp;&nbsp;&nbsp;" +
    // Math.floor(((e.max_val - e.min_val) / 8) * e.range_num).toString()
  );
};

const TotalArea = () => {
  const [totalarea, setTotalarea] = useState<projectsTotalArea[]>([]);
  const [maxRng, setMaxRng] = useState(0);

  useEffect(() => {
    getProjectArea()
      .then((projectNumData) => {
        setTotalarea(projectNumData);
        setMaxRng(projectNumData[0].max_val);
      })
      .catch((error) => {});
  }, []);

  return (
    <TotalWrapper>
      <Chart>
        <ChartCategoryAxis>
          <ChartCategoryAxisItem categories={totalarea.map(categoryContent)}>
            <ChartCategoryAxisTitle text="Total Area (m²)" />
          </ChartCategoryAxisItem>
        </ChartCategoryAxis>

        <ChartValueAxis>
          <ChartValueAxisItem
            min={0}
            majorUnit={1}
            title={{ text: "Project count" }}
          />
        </ChartValueAxis>

        <ChartSeries>
          <ChartSeriesItem
            type="column"
            gap={2}
            spacing={0.25}
            data={totalarea.map((obj) => obj.item_count)}
            color="#00028f"
          ></ChartSeriesItem>
        </ChartSeries>
      </Chart>
    </TotalWrapper>
  );
};

export default TotalArea;
