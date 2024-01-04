import React, { useState, useEffect } from "react";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import {
  RadioButton,
  RadioButtonChangeEvent,
} from "@progress/kendo-react-inputs";
import {
  Splitter,
  SplitterOnChangeEvent,
} from "@progress/kendo-react-layout";
import SubBuildingList from "component/SubBuildingComponent/analysis/SubBuildingList";
import SingleColTable from "component/SubBuildingComponent/analysis/SubBuildingAnalysisTable_singleCol";
import SubBuildingAnalysisTableSubCol from "component/SubBuildingComponent/analysis/SubBuildingAnalysisTable_subCol";
import SubBuildingAnalysisGraph from "component/SubBuildingComponent/analysis/SubBuildingAnalysisGraph";

import { SubBuildingInfo } from "interface/SubBuildingInterface";
import {useProjectName, useBuildingInfo} from "App"

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

  const [subBuildingInfo, setSubBuildingInfo] = useState<
  SubBuildingInfo[]
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
    fetch(`${process.env.REACT_APP_API_URL}/sub_building/${buildingInfo?.id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((rawData) => {
        const data = JSON.parse(rawData);
        setSubBuildingInfo(data);
      })
      .catch((error) => console.error("Error:", error));
  }, [buildingInfo]);

  useEffect(() => {
    let concretePivotResponse: any;
    let formworkPivotResponse: any;
    let rebarResponse: any;
    const fetchData = async () => {
      if (selectedSubBuildingId === 0) {
        const concretePromise = fetch(
          `${process.env.REACT_APP_API_URL}/sub_building/analysis_table_all/${buildingInfo?.id}/concrete`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        )
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((rawData) => {
            return JSON.parse(rawData);
          });

        const formworkPromise = fetch(
          `${process.env.REACT_APP_API_URL}/sub_building/analysis_table_all/${buildingInfo?.id}/formwork`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        )
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((rawData) => {
            return JSON.parse(rawData);
          });

        const rebarPromise = fetch(
          `${process.env.REACT_APP_API_URL}/sub_building/analysis_table_all/${buildingInfo?.id}/rebar`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        )
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((rawData) => {
            return JSON.parse(rawData);
          });

        [concretePivotResponse, formworkPivotResponse, rebarResponse] =
          await Promise.all([concretePromise, formworkPromise, rebarPromise]);
      } else {
        const concretePromise = fetch(
          `${process.env.REACT_APP_API_URL}/sub_building/analysis_table/${buildingInfo?.id}/concrete`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        )
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((rawData) => {
            return JSON.parse(rawData);
          });

        const formworkPromise = fetch(
          `${process.env.REACT_APP_API_URL}/sub_building/analysis_table/${buildingInfo?.id}/formwork`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        )
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((rawData) => {
            return JSON.parse(rawData);
          });

        const rebarPromise = fetch(
          `${process.env.REACT_APP_API_URL}/sub_building/analysis_table/${buildingInfo?.id}/rebar`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        )
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((rawData) => {
            return JSON.parse(rawData);
          });

        [concretePivotResponse, formworkPivotResponse, rebarResponse] =
          await Promise.all([concretePromise, formworkPromise, rebarPromise]);
      }

      if (
        concretePivotResponse === undefined ||
        formworkPivotResponse === undefined ||
        rebarResponse === undefined
      )
        return;
      const concretePivotJsonGrid: gridData = Object.entries(
        concretePivotResponse
      ).map(([key, value]) => {
        const newObj: { [key: string]: any } = { "": key };
        for (const prop in value as Record<string, any>) {
          newObj[prop] = (value as Record<string, any>)[prop];
        }
        return newObj as { [key: string]: any } & { "": string };
      });
      const formworkPivotJsonGrid: gridData = Object.entries(
        formworkPivotResponse
      ).map(([key, value]) => {
        const newObj: { [key: string]: any } = { "": key };
        for (const prop in value as Record<string, any>) {
          newObj[prop] = (value as Record<string, any>)[prop];
        }
        return newObj as { [key: string]: any } & { "": string };
      });

      const rebarJsonPivotGrid: gridData = [];
      for (const rebar of rebarResponse) {
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
                <SingleColTable
                  data={concreteData}
                ></SingleColTable>
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
                <SingleColTable
                  data={formworkData}
                ></SingleColTable>
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
