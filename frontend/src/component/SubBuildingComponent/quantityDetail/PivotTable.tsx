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
import { Loader } from "@progress/kendo-react-indicators";


const dimensions: { [key: string]: Dimension } = {
  Floor: {
    caption: "Floor",
    displayValue: (item) => item.층이름,
    sortValue: (displayValue: string) => displayValue,
  },
  ComponentType: {
    caption: "Component Type",
    displayValue: (item) => item.부재타입,
    sortValue: (displayValue: string) => displayValue,
  },
  SectionName: {
    caption: "Section",
    displayValue: (item) => item.단면이름,
    sortValue: (displayValue: string) => displayValue,
  },
  CZone: {
    caption: "CZone",
    displayValue: (item) => item.시공존,
    sortValue: (displayValue: string) => displayValue,
  },
};

const measures: Measure[] = [
  { name: "Total", value: (item) => item.체적, aggregate: sumAggregate },
  { name: "Max", value: (item) => item.체적, aggregate: maxAggregate },
  { name: "Min", value: (item) => item.체적, aggregate: minAggregate },
  { name: "Average", value: (item) => item.체적, aggregate: averageAggregate },
];

const defaultMeasureAxes: PivotGridAxis[] = [{ name: ["Total"] }];

const defaultRowAxes: PivotGridAxis[] = [
  { name: ["Floor"]},  
];

const defaultColumnAxes: PivotGridAxis[] = [
  { name: ["ComponentType"]},  
];

const defaultFilter: FilterDescriptor[] = [];
const defaultSort: SortDescriptor[] = Object.keys(dimensions).map((key) => ({
  field: key,
  dir: "asc" as "asc",
}));

//props.data
const PivotTable = (props: any) => {
  const [showConfig, setShowConfig] = useState(false);
  const [showPivot, setShowPivot] = useState(false);

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


  useEffect(() => {
    setData(props.data);
  }, [props.data]);
  useEffect(() => {

  }, [data]);

  const handleButtonClick = React.useCallback(() => {
    setShowConfig(!showConfig);
  }, [showConfig]);

  const handleShowPivotButtonClick = React.useCallback(() => {
    setShowPivot(!showPivot);
  }, [showPivot]);

  return <div>{props.data.length > 0 ? <div></div> : 
    <div>
       <PivotGridContainer>
        {showPivot &&<PivotGrid
          {...pivotProps}
          style={{
            height: state.loading ? 350 : undefined,
            maxHeight: state.loading ? undefined : 460,
          }}
        />}
        {showConfig && <PivotGridConfigurator {...configuratorProps} />}
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
    </div>
    }</div>;
};

export default PivotTable;
