import { useState, useEffect } from "react";
import axios from "axios";
import {
  Chart,
  ChartLegend,
  ChartSeries,
  ChartSeriesItem,
  ChartTooltip,
} from "@progress/kendo-react-charts";
import urlPrefix from "./../../resource/URL_prefix.json";
import "./../../styles/ChartFont.scss";

const LocalPercentage = () => {
  const [percentages, setPercentages] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          urlPrefix.IP_port + "/dashboard/project/location_ratio"
        );
        const data = JSON.parse(response.data);

        // 데이터를 내림차순으로 정렬
        // data.sort((a: any, b: any) => b.percentage - a.percentage);

        // 상위 5개 데이터 추출
        const top5 = data.slice(0, 5);

        // 나머지 데이터 합산하여 "Others" 데이터 생성
        const othersPercentage = data
          .slice(5)
          .reduce((acc: number, curr: any) => acc + curr.percentage, 0);
        const othersData = { field: "Others", percentage: othersPercentage };

        // "Others" 데이터를 포함하여 새로운 배열 생성
        const modifiedData = [...top5, othersData];

        setPercentages(modifiedData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
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
    <div className="chart-container">
      <div className="local-percentage">
        <Chart style={{ height: "36vh" }}>
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
      </div>
    </div>
  );
};

export default LocalPercentage;
