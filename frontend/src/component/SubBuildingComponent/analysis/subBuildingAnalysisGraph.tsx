import React, { useEffect, useState } from "react";
import {
  Chart,
  ChartSeries,
  ChartSeriesItem,
  ChartCategoryAxis,
  ChartValueAxis,
  ChartTooltip,
  ChartCategoryAxisItem,
  ChartSeriesItemTooltip,
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
  const toolTipRender = (e: any) => {
    let value = e.point.dataItem.toFixed(2);
    let unit = "";
    let component_type = e.point.series.name;

    if (component_type.includes("Concrete")) {
      unit = "㎥";
      component_type = component_type.slice(9, component_type.length);
    } else if (component_type.includes("Formwork")) {
      unit = "㎡";
      component_type = component_type.slice(9, component_type.length);
    } else if (component_type.includes("Rebar")) {
      unit = "Ton";
      component_type = component_type.slice(7, component_type.length);
    }

    return (
      <div>
        <p>구분: {component_type}</p>
        <p>
          값: {value} {unit}
        </p>
      </div>
    );
  };

  const colorMapping: { [key: string]: string } = {};

  const getColor = (key: string) => {
    if (!colorMapping[key]) {
      colorMapping[key] = getRandomColor();
    }
    return colorMapping[key];
  };

  const getRandomColor = () => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return "#" + randomColor;
  };

  return props.groupedChartDataConcrete.length > 0 &&
    props.groupedChartDataFormwork.length > 0 &&
    props.groupedChartDataRebar.length > 0 ? (
    <div>
      <Chart>
        <ChartTooltip />
        <ChartSeries>
          {props.groupedChartDataConcrete.map((item: any, index: number) => (
            <ChartSeriesItem
              key={index}
              type="bar"
              stack={item.component_type}
              data={[item.total_volume]}
              name={`Concrete ${item.component_type} - ${item.material_name}`}
              visibleInLegend={true}
              color={getColor(`${item.material_name}`)}
            >
              <ChartSeriesItemTooltip render={toolTipRender} />
            </ChartSeriesItem>
          ))}
        </ChartSeries>
      </Chart>

      <Chart>
        <ChartTooltip />
        <ChartSeries>
          {props.groupedChartDataFormwork.map((item: any, index: number) => (
            <ChartSeriesItem
              key={index}
              type="bar"
              stack={item.component_type}
              data={[item.total_area]}
              name={`Formwork ${item.component_type} - ${item.formwork_type}`}
              visibleInLegend={true}
              color={getColor(`${item.formwork_type}`)}
            >
              <ChartSeriesItemTooltip render={toolTipRender} />
            </ChartSeriesItem>
          ))}
        </ChartSeries>
      </Chart>

      <Chart>
        <ChartTooltip />
        <ChartSeries>
          {props.groupedChartDataRebar.map((item: any, index: number) => (
            <ChartSeriesItem
              key={index}
              type="bar"
              stack={item.component_type}
              data={[item.total_weight]}
              name={`Rebar ${item.component_type} - ${item.rebar_grade}`}
              visibleInLegend={true}
              color={getColor(`${item.formwork_type}`)}
            >
              <ChartSeriesItemTooltip render={toolTipRender} />
            </ChartSeriesItem>
          ))}
        </ChartSeries>
      </Chart>
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default SubBuildingAnalysisGraph;
