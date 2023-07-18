import React, { useState, useEffect } from "react";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import SubBuildingList from "./subBuildingList";
import {
  RadioButton,
  RadioButtonChangeEvent,
} from "@progress/kendo-react-inputs";
import {
  Splitter,
  SplitterBar,
  SplitterOnChangeEvent,
} from "@progress/kendo-react-layout";
import axios from "axios";
import urlPrefix from "../../../resource/URL_prefix.json";
import SubBuildingAnalysisTable from "./subBuildingAnalysisTable";
import SubBuildingAnalysisTableSingleCol from "./subBuildingAnalysisTable_singleCol";
import SubBuildingAnalysisTableSubCol from "./subBuildingAnalysisTable_subCol";
import SubBuildingAnalysisGraph from "./subBuildingAnalysisGraph";
import "./../../../styles/analysisTab.scss";

import { subBuildingInfo_interface } from "../../../interface/subBuildingInfo_interface";

type gridData = Array<{ [key: string]: any } & { "": string }>;

const AnalysisTab = (props: any) => {
  const headerData = [
    {
      projectName: props.projectName,
      building_name: props.buildingInfo?.building_name,
    },
  ];

  const [selectedSubBuildingId, setSelectedSubBuildingId] = useState(0);

  const [subBuildingInfo, setSubBuildingInfo] = useState<
    subBuildingInfo_interface[]
  >([]);

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
    const fetchData = async () => {
      try {
        const response = await axios.get(
          urlPrefix.IP_port + "/sub_building/" + props.buildingInfo.id
        );

        const subBuildings = JSON.parse(response.data);
        setSubBuildingInfo(subBuildings);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [props.buildingInfo]);

  useEffect(() => {
    const fetchData = async () => {
      let concreteResponse;
      let formworkResponse;
      let rebarResponse;

      let concretePivotResponse;
      let formworkPivotResponse;

      try {
        if (selectedSubBuildingId === 0) {
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
          concretePivotResponse = await axios.get(
            urlPrefix.IP_port +
              "/sub_building/analysis_table_all/" +
              props.buildingInfo.id +
              "/concrete"
          );
          formworkPivotResponse = await axios.get(
            urlPrefix.IP_port +
              "/sub_building/analysis_table_all/" +
              props.buildingInfo.id +
              "/formwork"
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
              selectedSubBuildingId +
              "/concrete/non_pivot"
          );
          formworkResponse = await axios.get(
            urlPrefix.IP_port +
              "/sub_building/analysis_table/" +
              selectedSubBuildingId +
              "/formwork/non_pivot"
          );
          concretePivotResponse = await axios.get(
            urlPrefix.IP_port +
              "/sub_building/analysis_table/" +
              selectedSubBuildingId +
              "/concrete"
          );
          formworkPivotResponse = await axios.get(
            urlPrefix.IP_port +
              "/sub_building/analysis_table/" +
              selectedSubBuildingId +
              "/formwork"
          );
          rebarResponse = await axios.get(
            urlPrefix.IP_port +
              "/sub_building/analysis_table/" +
              selectedSubBuildingId +
              "/rebar"
          );
        }

        const concreteJson = JSON.parse(concreteResponse.data);
        const formworkJson = JSON.parse(formworkResponse.data);
        const concretePivotJson = JSON.parse(concretePivotResponse.data);
        const formworkPivotJson = JSON.parse(formworkPivotResponse.data);
        const rebarJson = JSON.parse(rebarResponse.data);

        const concretePivotJsonGrid: gridData = Object.entries(
          concretePivotJson
        ).map(([key, value]) => {
          const newObj: { [key: string]: any } = { "": key };
          for (const prop in value as Record<string, any>) {
            newObj[prop] = (value as Record<string, any>)[prop];
          }
          return newObj as { [key: string]: any } & { "": string };
        });
        const formworkPivotJsonGrid: gridData = Object.entries(
          formworkPivotJson
        ).map(([key, value]) => {
          const newObj: { [key: string]: any } = { "": key };
          for (const prop in value as Record<string, any>) {
            newObj[prop] = (value as Record<string, any>)[prop];
          }
          return newObj as { [key: string]: any } & { "": string };
        });

        const rebarJsonPivotGrid: gridData = [];
        for (const rebar of rebarJson) {
          const componentType = rebar.component_type;
          const rebarGrade = rebar.rebar_grade;
          const rebarDiameter = rebar.rebar_diameter;
          const totalWeight = rebar.total_weight;

          const existingItem = rebarJsonPivotGrid.find(
            (item) => item[""] === componentType
          );
          if (existingItem) {
            if (!existingItem[rebarGrade]) {
              existingItem[rebarGrade] = {};
            }
            existingItem[rebarGrade][rebarDiameter.toString()] = totalWeight;
          } else {
            const newItem = {
              "": componentType,
              [rebarGrade]: {
                [rebarDiameter.toString()]: totalWeight,
              },
            };
            rebarJsonPivotGrid.push(newItem);
          }
        }

        setConcreteData(concretePivotJsonGrid);
        setFormworkData(formworkPivotJsonGrid);
        setRebarData(rebarJsonPivotGrid);
      } catch (error) {
        console.error(
          "Error fetching data in sub_building_analysis_graph:",
          error
        );
      }
    };

    fetchData();
  }, [selectedSubBuildingId]);

  useEffect(() => {
    const temp: string[] = [];
    const tempRebarColumns = [{}];
    rebarData.map((item, index) => {
      Object.entries(item).map((cols) => {
        temp.push(cols[0]);
      });
    });
    temp.sort();
    const tempSet = new Set(temp);
    Array.from(tempSet).map((strength) => {
      const DiametersInStrength: string[] = rebarData.reduce(
        (keys: string[], obj) => {
          for (const key in obj) {
            if (key === strength) {
              keys.push(...Object.keys(obj[key]));
            }
          }
          keys.sort();
          const keysSet = new Set(keys);
          return Array.from(keysSet);
        },
        []
      );

      tempRebarColumns.push({ [strength]: DiametersInStrength });
    });
    setRebarColumns(tempRebarColumns);

    let nonSubKeyData = rebarData.map((item) => {
      const newObj: { [key: string]: any } = { "": item[""] };
      for (const key in item) {
        if (key !== "") {
          const subItem = item[key];
          for (const subKey in subItem) {
            newObj[`${key}_${subKey}`] = subItem[subKey];
          }
        }
      }
      return newObj;
    });

    let allSubKeys = new Set<string>();
    nonSubKeyData.map((item) => {
      for (const key of Object.keys(item)) {
        if (key !== "") allSubKeys.add(key);
      }
    });
    nonSubKeyData = nonSubKeyData.map((item: any) => {
      const newObj: { [key: string]: any } = {};
      newObj[""] = item[""];

      for (const key of Array.from(allSubKeys)) {
        newObj[key] = item[key] === undefined ? null : item[key];
      }

      return newObj;
    });

    setRebarDataNonSubKey(nonSubKeyData as gridData);
  }, [rebarData]);

  useEffect(() => {
    //console.log(rebarDataNonSubKey);
  }, [rebarDataNonSubKey]);

  useEffect(() => {
    switch (selectedType) {
      case "Concrete":
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
      case "Formwork":
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
  }, [selectedType, concreteData, formworkData, rebarData, rebarDataNonSubKey,rebarColumns,panes]);

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
              <div style={{ textAlign: "center" }}>
                <SubBuildingList
                  buildingInfo={props.buildingInfo}
                  projectName={props.projectName}
                  setSelectedSubBuildingId={setSelectedSubBuildingId}
                  selectedSubBuildingId={selectedSubBuildingId}
                  selectedSubBuildingName={
                    props.selectedSubBuildingInfo?.sub_building_name
                  }
                  subBuildingInfo={subBuildingInfo}
                />
              </div>
            )}
            headerClassName="custom-header-cell"
            className="custom-text-cell"
          />
        </Grid>
      </div>

      <div className="button-container">
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