import React, { useEffect, useState } from "react";
import {
  Chart,
  ChartSeries,
  ChartSeriesItem,
  ChartCategoryAxis,
  ChartValueAxis,
  ChartCategoryAxisItem,
} from "@progress/kendo-react-charts";
import axios from "axios";

import urlPrefix from "../../../resource/URL_prefix.json";

interface RebarJson {
  component_type: string;
  rebar_grade: string;
  rebar_diameter: number;
  total_weight: number;
}

const SubBuildingAnalysisGraph = (props: any) => {
  const [graphDataRebar, setGraphDataRebar] = useState<RebarJson[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          urlPrefix.IP_port +
            "/sub_building/analysis_table/" +
            props.selectedSubBuildingId +
            "/rebar"
        );
        const response_json = JSON.parse(response.data);
        setGraphDataRebar(response_json);
      } catch (error) {
        console.error(
          "Error fetching data in sub_building_analysis_graph:",
          error
        );
      }
    };

    fetchData();
  }, [props]);

  // 데이터를 그룹화
  const groupedDataRebar = graphDataRebar.reduce(
    (acc: any, item: RebarJson) => {
      const { component_type, rebar_grade, total_weight } = item;
      const key = `${component_type}-${rebar_grade}`;

      if (acc[key]) {
        acc[key].total_weight += total_weight;
      } else {
        acc[key] = {
          component_type,
          rebar_grade,
          total_weight,
        };
      }

      return acc;
    },
    {}
  );

  // 그룹화된 Rebar 데이터를 배열로 변환
  const groupedChartData = Object.values(groupedDataRebar);

  return (
    <div>
      {groupedChartData.length > 0 ? (
        <Chart>
          <ChartSeries>
            {groupedChartData.map((item: any, index) => (
              <ChartSeriesItem
                key={index}
                type="bar"
                stack={item.component_type}
                data={[item.total_weight]}
                name={`${item.component_type} - ${item.rebar_grade}`}
                visibleInLegend={false}
              />
            ))}
          </ChartSeries>
        </Chart>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default SubBuildingAnalysisGraph;
