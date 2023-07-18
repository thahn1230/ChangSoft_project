import React, { useState, useEffect } from "react";
import {
  Chart,
  ChartSeries,
  ChartSeriesItem,
  ChartCategoryAxis,
  ChartValueAxis,
  ChartTooltip,
  ChartCategoryAxisItem,
  ChartSeriesItemTooltip,
  ChartCategoryAxisTitle,
  ChartLegend,
} from "@progress/kendo-react-charts";

const toolTipRender = (e: any) => {
  return (<div><div>구분 :{e.point.series.name} </div>< div> 값 :{e.point.dataItem}</div></div>);
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

const SubBuildingAnalysisGraph = (props: any) => {
  const [categories, setCategories] = useState<string[]>([]);

  const [isLoaded, setIsLoaded] =useState<Boolean>(false);

  useEffect(() => {
    if (props.data !== undefined && props.data.length !== 0) {
      setCategories(Object.keys(props.data[0]));
      setIsLoaded(true);

    }
  }, [props.data]);

  return (
    (isLoaded ? (
    <div style={{height: "60vh",  overflow: "scroll"}}>
      <Chart style={{height: `${props.data.length * 5 + 10}vh`}}>
        <ChartTooltip />
        <ChartSeries>
          {categories.map((item: any, index: number) => {
            return (
              <ChartSeriesItem
                type="bar"
                stack={{group : ""}}
                data={props.data.map((obj:any)=> obj[item])}
                name={item}
                visibleInLegend={true}
                //color={getColor(`${materialType}`)}
              >
                <ChartSeriesItemTooltip render={toolTipRender} />
              </ChartSeriesItem>
            );
          })}
        </ChartSeries>
        <ChartCategoryAxis>
            <ChartCategoryAxisItem categories={props.data.map((obj:any)=>obj[""])}>
              <ChartCategoryAxisTitle text="구분" />
            </ChartCategoryAxisItem>
          </ChartCategoryAxis>
      </Chart>
    </div>
  ) : null)
  );
};

export default SubBuildingAnalysisGraph;
