import * as ReactDOM from "react-dom";
import React, { useEffect, useState, useCallback } from "react";
import {
  PivotGrid,
  PivotGridContainer,
  PivotGridConfigurator,
  sumAggregate,
  minAggregate,
  maxAggregate,
  averageAggregate,
  Dimension,
  Measure,
  usePivotLocalDataService,
  PivotLocalDataServiceArgs,
  PivotGridAxis,
  PivotGridConfiguratorButton,
} from "@progress/kendo-react-pivotgrid";
import { Loader } from "@progress/kendo-react-indicators";

import { chartData } from "./chart-data";

import "./pivot_styles.css";

import { FilterDescriptor, SortDescriptor } from "@progress/kendo-data-query";

import {
  Chart,
  ChartCategoryAxis,
  ChartCategoryAxisItem,
  ChartLegend,
  ChartSeries,
  TooltipContext,
  ChartSeriesItem,
  ChartArea,
  ChartTooltip,
  ChartSeriesItemTooltip,
} from "@progress/kendo-react-charts";

const dimensions: { [key: string]: Dimension } = {
  CZone: {
    caption: "시공존",
    displayValue: (item) => item.시공존,
    sortValue: (displayValue: string) => displayValue,
  }, 
  ObjectID: {
    caption: "객체ID",
    displayValue: (item) => item.객체ID,
    sortValue: (displayValue: string) => displayValue,
  },
  Building: {
    caption: "건물명",
    displayValue: (item) => item.건물명,
    sortValue: (displayValue: string) => displayValue,
  },
  FloorName: {
    caption: "층이름",
    displayValue: (item) => item.층이름,
    sortValue: (displayValue: string) => displayValue,
  },
  Section: {
    caption: "단면이름",
    displayValue: (item) => item.단면이름,
    sortValue: (displayValue: string) => displayValue,
  },
  ComponentType: {
    caption: "부재타입",
    displayValue: (item) => item.부재타입,
    sortValue: (displayValue: string) => displayValue,
  },
};
const measures: Measure[] = [
  {
    name: "Total",
    value: (item) => ('체적' in item ? item.체적 : '면적' in item ? item.면적 : item.중량),
    aggregate: sumAggregate,
  },
  {
    name: "Max",
    value: (item) => ('체적' in item ? item.체적 : '면적' in item ? item.면적 : item.중량),
    aggregate: maxAggregate,
  },
  {
    name: "Min",
    value: (item) => ('체적' in item ? item.체적 : '면적' in item ? item.면적 : item.중량),
    aggregate: minAggregate,
  },
  {
    name: "Average",
    value: (item) => ('체적' in item ? item.체적 : '면적' in item ? item.면적 : item.중량),
    aggregate: averageAggregate,
  },
];


const defaultMeasureAxes: PivotGridAxis[] = [{ name: ["Total"] }];

const defaultRowAxes: PivotGridAxis[] = [{ name: ["FloorName"], expand: true }];

const defaultColumnAxes: PivotGridAxis[] = [
  { name: ["ComponentType"], expand: true },
];

const defaultFilter: FilterDescriptor[] = [];
const defaultSort: SortDescriptor[] = Object.keys(dimensions).map((k) => ({
  field: k,
  dir: "asc" as "asc",
}));

interface PivotTableChartInfo {
  data : [];
  isLoading : boolean;
}

const PivotTableChart = (props: PivotTableChartInfo) => {
  const [show, setShow] = React.useState(false);

  const handleButtonClick = React.useCallback(() => {
    setShow(!show);
  }, [show]);

  const [data, setData] = useState<any[]>([]);
  useEffect(() => {
    console.log("props.data:", props.data); // props.data 출력
    if (props.data === undefined) {
      console.log("props.data is undefined");

      setData([]);
    } else setData(props.data);
  }, [props.data]);

  const serviceArgs: PivotLocalDataServiceArgs = {
    dimensions,
    measures,
    data,

    defaultRowAxes,
    defaultColumnAxes,
    defaultMeasureAxes,
    defaultSort,
    defaultFilter,
  };

  const { pivotProps, configuratorProps, state } =
    usePivotLocalDataService(serviceArgs);
  const tooltipRender = React.useCallback((props: TooltipContext) => {
    const { point } = props;
    const series = point.series;

    return (
      <div>
        {series.name === series.stack
          ? series.name
          : series.stack + "/" + series.name}
        : {point.value}
      </div>
    );
  }, []);

  const { series, categories } = chartData(pivotProps);

  return (
    <div>
      <PivotGridContainer>
        <PivotGrid
          {...pivotProps}
          style={{
            height: state.loading ? 350 : undefined,
            maxHeight: state.loading ? undefined : 460,
          }}
        />
        {show && <PivotGridConfigurator {...configuratorProps} />}
        <PivotGridConfiguratorButton onClick={handleButtonClick} />
        {state.loading && (
          <Loader
            style={{
              position: "absolute",
              top: "60%",
              left: "50%",
              transform: "translate(-50%,-50%)",
            }}
            size="large"
          />
        )}
      </PivotGridContainer>
      <br />
      <Chart>
        <ChartArea height={500} />
        <ChartLegend position="bottom" orientation="horizontal" />
        <ChartCategoryAxis>
          <ChartCategoryAxisItem categories={categories} startAngle={45} />
        </ChartCategoryAxis>
        {/* <ChartTooltip shared={false} render={tooltipRender} /> */}
        <ChartSeries>
          {series.map((item, idx) => (
            <ChartSeriesItem
              key={idx}
              type="column"
              data={item.data}
              name={item.name}
              stack={item.stack}
            >
              <ChartSeriesItemTooltip />
            </ChartSeriesItem>
          ))}
        </ChartSeries>
      </Chart>
    </div>
  );
};

export default PivotTableChart;
