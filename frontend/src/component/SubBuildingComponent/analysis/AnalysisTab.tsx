import React, { useState, useEffect } from "react";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import {
  RadioButton,
  RadioButtonChangeEvent,
} from "@progress/kendo-react-inputs";
import { Splitter, SplitterOnChangeEvent } from "@progress/kendo-react-layout";
import SubBuildingList from "component/SubBuildingComponent/analysis/SubBuildingList";
import SingleColTable from "component/SubBuildingComponent/analysis/SubBuildingAnalysisTable_singleCol";
import SubBuildingAnalysisTableSubCol from "component/SubBuildingComponent/analysis/SubBuildingAnalysisTable_subCol";
import SubBuildingAnalysisGraph from "component/SubBuildingComponent/analysis/SubBuildingAnalysisGraph";

import { SubBuildingInfo } from "interface/SubBuildingInterface";
import { useProjectName, useBuildingInfo } from "App";

import {
  getSubBuildingInfo,
  fetchBuildingAnalysisData,
} from "services/subbuilding/subbuildingService";
import {
  getGridFromPivotData,
  getRebarGridFromPivotData,
  getRebarColumnsFromData,
  getRebarDataWithoutSubkey,
} from "services/subbuilding/subBuildingUtils";

import "styles/analysisTab.scss";

type gridData = Array<{ [key: string]: any } & { "": string }>;

const AnalysisTab = () => {
  const [buildingInfo, setBuildingInfo] = useBuildingInfo();
  const [projectName, setProjectName] = useProjectName();

  const headerData = [
    {
      projectName: projectName,
      building_name: buildingInfo?.building_name,
    },
  ];

  const [selectedSubBuildingId, setSelectedSubBuildingId] = useState(0);

  const [subBuildingInfo, setSubBuildingInfo] = useState<SubBuildingInfo[]>([]);

  const [concreteData, setConcreteData] = useState<gridData>([]);
  const [formworkData, setFormworkData] = useState<gridData>([]);
  const [rebarData, setRebarData] = useState<gridData>([]);
  const [rebarDataNonSubKey, setRebarDataNonSubKey] = useState<gridData>([]);
  const [rebarColumns, setRebarColumns] = useState<{}[]>();

  const [selectedType, setSelectedType] = useState("Concrete");
  const [selectedTypeHeader, setSelectedTypeHeader] = useState("콘크리트(㎥)");
  const [selectedGridChart, setSelectedGridChart] = useState(<div></div>);

  const [panes, setPanes] = React.useState<Array<any>>([
    { size: "40%", min: "20px", collapsible: true, scrollable: false },
    { scrollable: false },
  ]);
  const onPaneChange = (event: SplitterOnChangeEvent) => {
    setPanes(event.newState);
  };

  useEffect(() => {
    if (buildingInfo?.id === undefined) return;
    getSubBuildingInfo(buildingInfo.id).then((selectedSubBuildingInfo) => {
      setSubBuildingInfo(selectedSubBuildingInfo);
    });
  }, [buildingInfo]);

  useEffect(() => {
    if (buildingInfo?.id === undefined) return;
    let concretePivotResponse: any;
    let formworkPivotResponse: any;
    let rebarResponse: any;
    const fetchData = async () => {
      [concretePivotResponse, formworkPivotResponse, rebarResponse] =
        await fetchBuildingAnalysisData(
          buildingInfo.id,
          selectedSubBuildingId
        );

      if (
        concretePivotResponse === undefined ||
        formworkPivotResponse === undefined ||
        rebarResponse === undefined
      )
        return;

      const concretePivotJsonGrid: gridData = getGridFromPivotData(
        concretePivotResponse
      );
      const formworkPivotJsonGrid: gridData = getGridFromPivotData(
        formworkPivotResponse
      );
      const rebarJsonPivotGrid: gridData =
        getRebarGridFromPivotData(rebarResponse);

      setConcreteData(concretePivotJsonGrid);
      setFormworkData(formworkPivotJsonGrid);
      setRebarData(rebarJsonPivotGrid);
    };

    fetchData();
  }, [selectedSubBuildingId]);

  useEffect(() => {
    const rebarColumns = getRebarColumnsFromData(rebarData);
    setRebarColumns(rebarColumns);
    const nonSubKeyRebarData = getRebarDataWithoutSubkey(rebarData);
    setRebarDataNonSubKey(nonSubKeyRebarData as gridData);
  }, [rebarData]);

  useEffect(() => {
    switch (selectedType) {
      case "Concrete":
        setSelectedTypeHeader("콘크리트(㎥)");
        setSelectedGridChart(
          <div>
            <Splitter panes={panes} onChange={onPaneChange}>
              <div className="analysis-table-container">
                <SingleColTable data={concreteData}></SingleColTable>
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
      case "Formwork":
        setSelectedTypeHeader("거푸집(㎡)");
        setSelectedGridChart(
          <div>
            <Splitter panes={panes} onChange={onPaneChange}>
              <div className="analysis-table-container">
                <SingleColTable data={formworkData}></SingleColTable>
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
      case "Rebar":
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

  const onTypeChange = React.useCallback(
    (e: RadioButtonChangeEvent) => {
      setSelectedType(e.value);
    },
    [setSelectedType]
  );

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

          <GridColumn
            title="건물명 구분"
            cell={() => (
              <div style={{ textAlign: "center", margin: "3px" }}>
                <SubBuildingList
                  buildingInfo={buildingInfo}
                  projectName={projectName}
                  setSelectedSubBuildingId={setSelectedSubBuildingId}
                  selectedSubBuildingId={selectedSubBuildingId}
                  subBuildingInfo={subBuildingInfo}
                />
              </div>
            )}
            headerClassName="custom-header-cell"
            className="custom-text-cell"
          />
        </Grid>
      </div>

      <div className="radio-button-container">
        <RadioButton
          value="Concrete"
          checked={selectedType === "Concrete"}
          label="콘크리트"
          onChange={onTypeChange}
          style={{ marginLeft: "10px" }}
          className="k-radio-button"
        />
        <RadioButton
          value="Formwork"
          checked={selectedType === "Formwork"}
          label="거푸집"
          onChange={onTypeChange}
          style={{ marginLeft: "10px" }}
          className="k-radio-button"
        />
        <RadioButton
          value="Rebar"
          checked={selectedType === "Rebar"}
          label="철근"
          onChange={onTypeChange}
          style={{ marginLeft: "10px" }}
          className="k-radio-button"
        />
      </div>

      <div className="analysis-table-chart-container">
        <div>
          <header className="analysis-table-type">{selectedTypeHeader}</header>
          {selectedGridChart}
        </div>
      </div>
    </div>
  );
};

export default AnalysisTab;
