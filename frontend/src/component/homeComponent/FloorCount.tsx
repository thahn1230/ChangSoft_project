import React, { useState, useEffect } from "react";
import {
  Chart,
  ChartSeries,
  ChartTitle,
  ChartSeriesItem,
  ChartCategoryAxis,
  ChartCategoryAxisTitle,
  ChartCategoryAxisItem,
  ChartTooltip,
  ChartValueAxis,
  ChartValueAxisItem,
} from "@progress/kendo-react-charts";
import "hammerjs";
import urlPrefix from "resource/URL_prefix.json";
import "styles/ChartFont.scss";

interface ProjectsFloorCount {
  range_num: number;
  item_count: number;
}

const categoryContent = (e: any) => {
  return "&nbsp;&nbsp;" + (e.range_num * 10).toString();
};

const FloorCount = () => {
  const [totalfloor, setTotalfloor] = useState<ProjectsFloorCount[]>([]);

  useEffect(() => {
    fetch(urlPrefix.IP_port + "/dashboard/building/floor_count_histogram", {
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
      .then((data) => {
        const arrayData: ProjectsFloorCount[] = JSON.parse(data);
        setTotalfloor(arrayData);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  const renderTooltip = (e: any) => {
    return (
      <div>
        <p>Floors: {e.point.dataItem}</p>
      </div>
    );
  };

  return (
    <div>
      <Chart style={{ height: "36vh" }}>
        <ChartCategoryAxis>
          <ChartCategoryAxisItem categories={totalfloor.map(categoryContent)}>
            <ChartCategoryAxisTitle text="Stories (층)" />
          </ChartCategoryAxisItem>
        </ChartCategoryAxis>

        <ChartValueAxis>
          <ChartValueAxisItem title={{ text: "Building count" }} />
        </ChartValueAxis>

        <ChartSeries>
          <ChartSeriesItem
            type="column"
            gap={2}
            spacing={0.25}
            data={totalfloor.map((obj) => obj.item_count)}
            color="#00028f"
          ></ChartSeriesItem>
        </ChartSeries>
        <ChartTooltip render={renderTooltip} />
      </Chart>
    </div>
  );
};

export default FloorCount;
