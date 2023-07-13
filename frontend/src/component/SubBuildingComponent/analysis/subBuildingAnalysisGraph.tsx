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

interface ConcreteJson {
  component_type: string;
  material_name: string;
  total_volume: number;
}

interface FormworkJson {
  component_type: string;
  formwork_type: string;
  total_area: number;
}

interface RebarJson {
  component_type: string;
  rebar_grade: string;
  rebar_diameter: number;
  total_weight: number;
}

const SubBuildingAnalysisGraph = (props: any) => {
  const [graphDataConcrete, setGraphDataConcrete] = useState<ConcreteJson[]>(
    []
  );
  const [graphDataFormwork, setGraphDataFormwork] = useState<FormworkJson[]>(
    []
  );
  const [graphDataRebar, setGraphDataRebar] = useState<RebarJson[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      let concreteResponse;
      let formworkResponse;
      let rebarResponse;

      try {
        if (props.selectedSubBuildingId === 0) {
          concreteResponse = await axios.get(
            urlPrefix.IP_port +
              "/sub_building/analysis_table_all/" +
              props.buildingInfo.id +
              "/concrete/non_pivot"
          );
          formworkResponse = await axios.get(
            urlPrefix.IP_port +
              "/sub_building/analysis_table_all/" +
              props.buildingInfo.id +
              "/formwork/non_pivot"
          );
          rebarResponse = await axios.get(
            urlPrefix.IP_port +
              "/sub_building/analysis_table_all/" +
              props.buildingInfo.id +
              "/rebar"
          );
        } else {
          concreteResponse = await axios.get(
            urlPrefix.IP_port +
              "/sub_building/analysis_table/" +
              props.selectedSubBuildingId +
              "/concrete/non_pivot"
          );
          formworkResponse = await axios.get(
            urlPrefix.IP_port +
              "/sub_building/analysis_table/" +
              props.selectedSubBuildingId +
              "/formwork/non_pivot"
          );
          rebarResponse = await axios.get(
            urlPrefix.IP_port +
              "/sub_building/analysis_table/" +
              props.selectedSubBuildingId +
              "/rebar"
          );
        }

        const concreteJson = JSON.parse(concreteResponse.data);
        const formworkJson = JSON.parse(formworkResponse.data);
        const rebarJson = JSON.parse(rebarResponse.data);

        setGraphDataConcrete(concreteJson);
        setGraphDataFormwork(formworkJson);
        setGraphDataRebar(rebarJson);
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

  const groupedDataConcrete = graphDataConcrete.reduce(
    (acc: any, item: ConcreteJson) => {
      const { component_type, material_name, total_volume } = item;
      const key = `${component_type}-${material_name}`;

      if (acc[key]) {
        acc[key].total_volume += total_volume;
      } else {
        acc[key] = {
          component_type,
          material_name,
          total_volume,
        };
      }

      return acc;
    },
    {}
  );

  const groupedDataFormwork = graphDataFormwork.reduce(
    (acc: any, item: FormworkJson) => {
      const { component_type, formwork_type, total_area } = item;
      const key = `${component_type}-${formwork_type}`;

      if (acc[key]) {
        acc[key].total_area += total_area;
      } else {
        acc[key] = {
          component_type,
          formwork_type,
          total_area,
        };
      }

      return acc;
    },
    {}
  );

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

  // 그룹화된데이터를 배열로 변환

  const groupedChartDataConcrete = Object.values(groupedDataConcrete);
  const groupedChartDataFormwork = Object.values(groupedDataFormwork);
  const groupedChartDataRebar = Object.values(groupedDataRebar);

  return (
    <div>
      {" "}
      {groupedChartDataConcrete.length > 0 ? (
        <Chart>
          <ChartSeries>
            {groupedChartDataConcrete.map((item: any, index) => (
              <ChartSeriesItem
                key={index}
                type="bar"
                stack={item.component_type}
                data={[item.total_volume]}
                name={`${item.component_type} - ${item.material_name}`}
                visibleInLegend={true}
              />
            ))}
          </ChartSeries>
        </Chart>
      ) : (
        <div>Loading...</div>
      )}
      {groupedChartDataFormwork.length > 0 ? (
        <Chart>
          <ChartSeries>
            {groupedChartDataFormwork.map((item: any, index) => (
              <ChartSeriesItem
                key={index}
                type="bar"
                stack={item.component_type}
                data={[item.total_area]}
                name={`${item.component_type} - ${item.formwork_type}`}
                visibleInLegend={true}
              />
            ))}
          </ChartSeries>
        </Chart>
      ) : (
        <div>Loading...</div>
      )}
      {groupedChartDataRebar.length > 0 ? (
        <Chart>
          <ChartSeries>
            {groupedChartDataRebar.map((item: any, index) => (
              <ChartSeriesItem
                key={index}
                type="bar"
                stack={item.component_type}
                data={[item.total_weight]}
                name={`${item.component_type} - ${item.rebar_grade}`}
                visibleInLegend={true}
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
