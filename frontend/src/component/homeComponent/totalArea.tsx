import React, { useState, useEffect } from "react";
import {
  Chart,
  ChartTitle,
  ChartSeries,
  ChartValueAxisItem,
  ChartSeriesItem,
  ChartValueAxis,
  ChartCategoryAxis,
  ChartCategoryAxisTitle,
  ChartCategoryAxisItem,
} from "@progress/kendo-react-charts";
import "hammerjs";
import axios from "axios";
import urlPrefix from "./../../resource/URL_prefix.json";
import "./../../styles/Histogram.scss"
import "./../../styles/totalArea.scss"

interface projectsTotalArea {
  min_val: number;
  max_val: number;
  range_num: number;
  item_count: number;
}

const categoryContent = (e: any) => {
  return (
    "&nbsp;&nbsp;&nbsp;" +
    Math.floor(((e.max_val - e.min_val) / 8) * e.range_num).toString()
  );
};
const testData: projectsTotalArea[] = [
  {
    min_val: 1,
    max_val: 2,
    range_num: 3,
    item_count: 4,
  },
  {
    min_val: 1,
    max_val: 2,
    range_num: 3,
    item_count: 4,
  },
  {
    min_val: 1,
    max_val: 2,
    range_num: 3,
    item_count: 4,
  },
];

const TotalArea = () => {
  const [totalarea, setTotalarea] = useState<projectsTotalArea[]>([]);
  const [maxRng, setMaxRng] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          urlPrefix.IP_port + "/dashboard/project/total_area_histogram"
        );
        const data = JSON.parse(response.data);

        setTotalarea(data);
        setMaxRng(data[0].max_val);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bar-chart-container">
      <Chart style={{height: "36vh"}}>
        <ChartCategoryAxis>
          <ChartCategoryAxisItem categories={totalarea.map(categoryContent)}>
            <ChartCategoryAxisTitle text="Total Area (m²)"/>
          </ChartCategoryAxisItem>
        </ChartCategoryAxis>

        <ChartValueAxis>
          <ChartValueAxisItem min={0} majorUnit={1}/>
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
    </div>
  );
};

export default TotalArea;
