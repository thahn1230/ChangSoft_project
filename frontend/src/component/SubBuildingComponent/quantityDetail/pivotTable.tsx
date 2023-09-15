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
import { FilterDescriptor, SortDescriptor } from "@progress/kendo-data-query";


const dimensions: { [key: string]: Dimension } = {
  Category: {
    caption: "Categories",
    displayValue: (item) => item.Category,
    sortValue: (displayValue: string) => displayValue,
  },
  Product: {
    caption: "Products",
    displayValue: (item) => item.Product,
    sortValue: (displayValue: string) => displayValue,
  },
  Region: {
    caption: "Regions",
    displayValue: (item) => item.Region,
    sortValue: (displayValue: string) => displayValue,
  },
  Country: {
    caption: "Countries",
    displayValue: (item) => item.Country,
    sortValue: (displayValue: string) => displayValue,
  },
};

const measures: Measure[] = [
  { name: "Total", value: (item) => item.Price, aggregate: sumAggregate },
  { name: "Max", value: (item) => item.Price, aggregate: maxAggregate },
  { name: "Min", value: (item) => item.Price, aggregate: minAggregate },
  { name: "Average", value: (item) => item.Price, aggregate: averageAggregate },
];

const defaultMeasureAxes: PivotGridAxis[] = [{ name: ["Total"] }];

const defaultRowAxes: PivotGridAxis[] = [
  { name: ["Region"], expand: true },
  { name: ["Country"] },
];

const defaultColumnAxes: PivotGridAxis[] = [
  { name: ["Category"], expand: true },
  { name: ["Product"] },
];

const defaultFilter: FilterDescriptor[] = [];
const defaultSort: SortDescriptor[] = Object.keys(dimensions).map((key) => ({
  field: key,
  dir: "asc" as "asc",
}));

//props.data
const PivotTable = (props: any) => {
  const [showConfig, setShowConfig] = useState(false);

  const [data, setData] = useState<[]>([]);
  const [dimensions, setDimensions] = useState<{ [key: string]: Dimension }>(
    {}
  );
  const [measures, setMeasures] = useState<Measure[]>([]);

  const [defaultMeasureAxes, setDefaultMeasureAxes] = useState<PivotGridAxis[]>(
    []
  );
  const [defaultRowAxes, setDefaultRowAxes] = useState<PivotGridAxis[]>([]);
  const [defaultColumnAxes, setDefaultColumnAxes] = useState<PivotGridAxis[]>(
    []
  );
  const [defaultFilter, setDefaultFilter] = useState<FilterDescriptor[]>([]);
  const [defaultSort, setDefaultSort] = useState<SortDescriptor[]>([]);

  const [serviceArgs, setServiceArgs] = useState<PivotLocalDataServiceArgs>({
    dimensions,
    measures,
    data,

    defaultRowAxes,
    defaultColumnAxes,
    defaultMeasureAxes,
    defaultSort,
    defaultFilter,
  });

  const { pivotProps, configuratorProps, state } =
    usePivotLocalDataService(serviceArgs);


  useEffect(() => {
    setData(props.data);
  }, [props.data]);
  useEffect(() => {

  }, [data]);

  const handleButtonClick = React.useCallback(() => {
    setShowConfig(!showConfig);
  }, [showConfig]);

  return <div>{props.data.length > 0 ? <div></div> : <div></div>}</div>;
};

export default PivotTable;
