import { useState, useEffect } from "react";
import axios, { AxiosRequestConfig } from "axios";
import {
  Chart,
  ChartLegend,
  ChartSeries,
  ChartSeriesItem,
  ChartTooltip,
} from "@progress/kendo-react-charts";
import urlPrefix from "resource/URL_prefix.json";
import styled from "styled-components";

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

const CompanyPercentage = () => {
  const [percentages, setPercentages] = useState<PercentageInterface[]>([]);

  useEffect(() => {
    fetch(urlPrefix.IP_port + "/dashboard/project/construction_company_ratio", {
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
        const arrayData = JSON.parse(data);
        const top5 = arrayData.slice(0, 5);

        // 나머지 데이터 합산하여 "Others" 데이터 생성
        const othersPercentage = arrayData
          .slice(5)
          .reduce((acc: number, curr: any) => acc + curr.percentage, 0);
        const othersData = { field: "Others", percentage: othersPercentage };

        // "Others" 데이터를 포함하여 새로운 배열 생성
        const modifiedData = [...top5, othersData];

        setPercentages(modifiedData);
      })
      .catch((error) => console.error("Error:", error));
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
          />
        </ChartSeries>
        <ChartTooltip render={renderTooltip} />
      </Chart>
    </ChartWrapper>
  );
};

export default CompanyPercentage;
