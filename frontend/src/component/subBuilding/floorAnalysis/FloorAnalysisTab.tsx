import React, { useEffect, useState } from "react";
import axios from "axios";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { RadioButtonChangeEvent } from "@progress/kendo-react-inputs";
import { Splitter, SplitterOnChangeEvent } from "@progress/kendo-react-layout";

import SubBuildingAnalysisGraph from "component/subBuilding/analysis/SubBuildingAnalysisGraph";
import SubBuildingAnalysisTableSingleCol from "component/subBuilding/analysis/SubBuildingAnalysisTable_singleCol";
import SubBuildingAnalysisTableSubCol from "component/subBuilding/analysis/SubBuildingAnalysisTable_subCol";
import ComponentTypeList from "component/subBuilding/floorAnalysis/ComponentTypeList";
import { useProjectName, useBuildingInfo } from "App";

import {
  fetchSubBuildingFloorAnalysisData,
  getComponentTypeListFromBuildingId,
} from "services/subbuilding/subbuildingService";
import {
  getGridFromPivotData,
  getFloorRebarGridFromPivotData,
  getRebarColumnsFromData,
  getRebarDataWithoutSubkey,
} from "services/subbuilding/subBuildingUtils";

import "styles/FloorAnalysisTab.scss";

type gridData = Array<{ [key: string]: any } & { "": string }>;

const FloorAnalysisTab = () => {
  const [buildingInfo, setBuildingInfo] = useBuildingInfo();
  const [projectName, setProjectName] = useProjectName();

  const headerData = [
    {
      projectName: projectName,
      building_name: buildingInfo?.building_name,
    },
  ];

  const [concreteData, setConcreteData] = useState<gridData>([]);
  const [formworkData, setFormworkData] = useState<gridData>([]);
  const [rebarData, setRebarData] = useState<gridData>([]);
  const [rebarDataNonSubKey, setRebarDataNonSubKey] = useState<gridData>([]);
  const [rebarColumns, setRebarColumns] = useState<{}[]>();

  const [selectedType, setSelectedType] = useState("콘크리트(㎥)");
  const [selectedTypeHeader, setSelectedTypeHeader] = useState("콘크리트(㎥)");
  const [selectedGridChart, setSelectedGridChart] = useState(<div></div>);

  const [componentTypeList, setComponentTypeList] = useState<
    { componentType: string; id: number; checked: boolean }[]
  >([]);
  const [selectedComponentType, setSelectedComponentType] = useState<
    { componentType: string; id: number; checked: boolean }[]
  >([]);

  const [panes, setPanes] = React.useState<Array<any>>([
    { size: "40%", min: "20px", collapsible: true, scrollable: false },
    { scrollable: false },
  ]);
  const [fetched, setFetched] = useState<boolean>(false);

  const onPaneChange = (event: SplitterOnChangeEvent) => {
    setPanes(event.newState);
  };

  useEffect(() => {
    if (buildingInfo?.id === undefined) return;
    const fetchData = async () => {
      const newComponentTypeList = await getComponentTypeListFromBuildingId(
        buildingInfo?.id
      );
      setComponentTypeList(newComponentTypeList);
    };
    fetchData();
  }, [buildingInfo]);

  useEffect(() => {
    if (fetched) return;

    if (componentTypeList.length > 0) {
      setFetched(true);
      const listWithoutAll = componentTypeList.map((item) => ({
        ...item,
        checked: true,
      }));
      listWithoutAll.shift();
      setSelectedComponentType(listWithoutAll);
    }
  }, [componentTypeList]);

  useEffect(() => {
    if (buildingInfo?.id === undefined) return;
    const params = new URLSearchParams();
    const paramName = "component_types";
    const paramContent = JSON.stringify(
      selectedComponentType.map((item) => item.componentType)
    );
    params.append(paramName, paramContent);

    if (selectedComponentType.length === 0) {
      setSelectedGridChart(<div>부재를 선택해주세요.</div>);
    } else {
      let concreteGridData: any;
      let formworkGridData: any;
      let rebarGridData: any;
      
      const fetchData = async () => {
        //getGridFromPivotData,getRebarGridFromPivotData
        [concreteGridData, formworkGridData, rebarGridData] =
          await fetchSubBuildingFloorAnalysisData(buildingInfo.id, params);

        const concreteJsonGrid: gridData =
          getGridFromPivotData(concreteGridData);
        const formworkJsonGrid: gridData =
          getGridFromPivotData(formworkGridData);
        const rebarJsonGrid: gridData =
          getFloorRebarGridFromPivotData(rebarGridData);

        setConcreteData(concreteJsonGrid);
        setFormworkData(formworkJsonGrid);
        setRebarData(rebarJsonGrid);
      };
      fetchData();
    }
  }, [selectedComponentType]);

  useEffect(() => {
    const rebarColumns = getRebarColumnsFromData(rebarData)
    setRebarColumns(rebarColumns);
    const nonSubKeyRebarData = getRebarDataWithoutSubkey(rebarData)
    setRebarDataNonSubKey(nonSubKeyRebarData as gridData);
  }, [rebarData]);

  useEffect(() => {
    if (selectedComponentType.length === 0) {
      switch (selectedType) {
        case "콘크리트(㎥)":
          setSelectedTypeHeader("콘크리트(㎥)");
          break;
        case "거푸집(㎡)":
          setSelectedTypeHeader("거푸집(㎡)");
          break;
        case "철근(Ton)":
          setSelectedTypeHeader("철근(Ton)");
          break;
      }
      return;
    }
    switch (selectedType) {
      case "콘크리트(㎥)":
        setSelectedTypeHeader("콘크리트(㎥)");
        setSelectedGridChart(
          <div>
            <Splitter panes={panes} onChange={onPaneChange}>
              <div className="analysis-table-container">
                <SubBuildingAnalysisTableSingleCol
                  data={concreteData}
                ></SubBuildingAnalysisTableSingleCol>
              </div>
              <div className="analysis-chart-container">
                <SubBuildingAnalysisGraph
                  data={concreteData}
                  componentType={"Concrete"}
                ></SubBuildingAnalysisGraph>
              </div>
            </Splitter>
          </div>
        );
        break;
      case "거푸집(㎡)":
        setSelectedTypeHeader("거푸집(㎡)");
        setSelectedGridChart(
          <div>
            <Splitter panes={panes} onChange={onPaneChange}>
              <div className="analysis-table-container">
                <SubBuildingAnalysisTableSingleCol
                  data={formworkData}
                ></SubBuildingAnalysisTableSingleCol>
              </div>
              <div className="analysis-chart-container">
                <SubBuildingAnalysisGraph
                  data={formworkData}
                  componentType={"Formwork"}
                ></SubBuildingAnalysisGraph>
              </div>
            </Splitter>
          </div>
        );
        break;
      case "철근(Ton)":
        setSelectedTypeHeader("철근(Ton)");
        setSelectedGridChart(
          <div>
            <Splitter panes={panes} onChange={onPaneChange}>
              <div className="analysis-table-container">
                <SubBuildingAnalysisTableSubCol
                  data={rebarData}
                  columns={rebarColumns}
                ></SubBuildingAnalysisTableSubCol>
              </div>
              <div className="analysis-chart-container">
                <SubBuildingAnalysisGraph
                  data={rebarDataNonSubKey}
                  componentType={"Rebar"}
                ></SubBuildingAnalysisGraph>
              </div>
            </Splitter>
          </div>
        );
        break;
    }
  }, [
    selectedType,
    concreteData,
    formworkData,
    rebarData,
    rebarDataNonSubKey,
    rebarColumns,
    panes,
  ]);

  const onSelectedTypeChange = (e: any) => {
    setSelectedType(e.value);
  };

  return (
    <div className="pageDiv">
      <div className="info-table-container">
        <Grid data={headerData}>
          <GridColumn
            title="프로젝트명"
            field="projectName"
            headerClassName="custom-header-cell"
            className="custom-text-cell"
          />
          <GridColumn
            title="빌딩명"
            field="building_name"
            headerClassName="custom-header-cell"
            className="custom-text-cell"
          />
        </Grid>
      </div>

      <div className="component-type-selection"></div>

      <div className="analysis-table-chart-container">
        <div>
          {/* <header className="analysis-table-type">{selectedTypeHeader}</header> */}

          <div className="type-selection-container">
            <label className="list-label">구분: </label>
            <div className="type-selection-dropdown">
              <DropDownList
                data={["콘크리트(㎥)", "거푸집(㎡)", "철근(Ton)"]}
                value={selectedType}
                onChange={onSelectedTypeChange}
              />
            </div>
            <label className="list-label">부재: </label>
            <div className="component-type-selection">
              <ComponentTypeList
                componentTypeList={componentTypeList}
                selectedComponentType={selectedComponentType}
                setComponentTypeList={setComponentTypeList}
                setSelectedComponentType={setSelectedComponentType}
              />
            </div>
          </div>
          {selectedGridChart}
        </div>
      </div>
    </div>
  );
};

export default FloorAnalysisTab;
