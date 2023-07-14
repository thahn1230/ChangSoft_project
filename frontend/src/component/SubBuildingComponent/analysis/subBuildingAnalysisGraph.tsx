import React from "react";
import {
  Chart,
  ChartSeries,
  ChartSeriesItem,
  ChartCategoryAxis,
  ChartValueAxis,
  ChartTooltip,
  ChartCategoryAxisItem,
  ChartSeriesItemTooltip,
  ChartLegend,
} from "@progress/kendo-react-charts";

const toolTipRender = (e: any) => {
  let value = parseFloat(e.point.dataItem).toFixed(2);
  let unit = "";
  let component_type = e.point.series.name.split(" ").slice(1).join(" ");

  switch (e.point.series.name.split(" ")[0]) {
    case "Concrete":
      unit = "㎥";
      break;
    case "Formwork":
      unit = "㎡";
      break;
    case "Rebar":
      unit = "Ton";
      break;
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
    colorMapping[key] = getRandomColor(); // 랜덤 색상 생성 또는 원하는 색상을 할당할 수 있습니다.
  }

  return colorMapping[key];
};

const getRandomColor = () => {
  const blueShades = ["#E6F0FF", "#B3D9FF", "#80C1FF", "#4DA9FF", "#1A91FF"];
  const randomIndex = Math.floor(Math.random() * blueShades.length);
  return blueShades[randomIndex];
};

const SubBuildingAnalysisGraph2 = (props: any) => {
  return (
    props.data.length && (
      <div>
        <Chart>
          <ChartTooltip />
          <ChartSeries>
            {props.data.map((item: any, index: number) => {
              const componentType = String(Object.values(item)[0]);
              const materialType = String(Object.values(item)[1]);
              const value = Number(Object.values(item)[2]);

              console.log("compt");
              console.log(componentType);
              console.log(item.component_type);
              console.log(index)
              return (
                <ChartSeriesItem
                  key={index}
                  type="bar"
                  stack={componentType}
                  data={[value]}
                  name={`${props.componentType} ${componentType} - ${materialType}`}
                  visibleInLegend={true}
                  color={getColor(`${materialType}`)}
                >
                  <ChartSeriesItemTooltip render={toolTipRender} />
                </ChartSeriesItem>
              );
            })}
          </ChartSeries>
        </Chart>
      </div>
    )
  );
};

export default SubBuildingAnalysisGraph2;
