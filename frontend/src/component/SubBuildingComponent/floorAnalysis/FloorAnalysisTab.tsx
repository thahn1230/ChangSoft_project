import React, { useEffect, useState } from "react";
import axios from "axios";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import {
  RadioButton,
  RadioButtonChangeEvent,
} from "@progress/kendo-react-inputs";
import {
  Splitter,
  SplitterBar,
  SplitterOnChangeEvent,
} from "@progress/kendo-react-layout";

import SubBuildingFloorAnalysisTable from "./SubBuildingFloorAnalysisTable";
import SubBuildingAnalysisGraph from "../analysis/SubBuildingAnalysisGraph";
import SubBuildingAnalysisTableSingleCol from "../analysis/SubBuildingAnalysisTable_singleCol";
import SubBuildingAnalysisTableSubCol from "../analysis/SubBuildingAnalysisTable_subCol";
import ComponentTypeList from "./ComponentTypeList";

import urlPrefix from "../../../resource/URL_prefix.json";

import "./../../../styles/FloorAnalysisTab.scss";

interface RebarJson {
  floor_name: string;
  rebar_grade: string;
  rebar_diameter: number;
  total_rebar: number;
}

type gridData = Array<{ [key: string]: any } & { "": string }>;

const FloorAnalysisTab = (props: any) => {
  const headerData = [
    {
      projectName: props.projectName,
      building_name: props.buildingInfo?.building_name,
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
    let idx = 0;
    fetch(
      urlPrefix.IP_port +
        "/sub_building/floor_analysis_table/" +
        props.buildingInfo.id +
        "/component_type",
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
      .then((response) => {
        // const arrayData: ProjectsFloorCount[] = JSON.parse(data);
        // setTotalfloor(arrayData);
        setComponentTypeList(
          [{ componentType: "All", id: idx++, checked: false }].concat(
            JSON.parse(response).map((item: any) => {
              return {
                componentType: item.component_type,
                id: idx++,
                checked: false,
              };
            })
          )
        );

      })
      .catch((error) => console.error("Error:", error));
  }, [props.buildingInfo]);

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
    const params = new URLSearchParams();
    const paramName = "component_types";
    const paramContent = JSON.stringify(
      selectedComponentType.map((item) => item.componentType)
    );
    params.append(paramName, paramContent);

    if (selectedComponentType.length === 0) {
      setSelectedGridChart(<div>부재를 선택해주세요.</div>);
    } else {
      const concreteUrl = new URL(
        `${urlPrefix.IP_port}/sub_building/floor_analysis_table/${props.buildingInfo.id}/concrete/filter`
      );
      concreteUrl.search = new URLSearchParams(params).toString();
      fetch(concreteUrl.toString(), {
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
        .then((response) => {
          const concreteJson = JSON.parse(response);
          const concreteJsonGrid: gridData = Object.entries(concreteJson).map(
            ([key, value]) => {
              const newObj: { [key: string]: any } = { "": key };
              for (const prop in value as Record<string, any>) {
                newObj[prop] = (value as Record<string, any>)[prop];
              }
              return newObj as { [key: string]: any } & { "": string };
            }
          );
          setConcreteData(concreteJsonGrid);
        })
        .catch((error) => console.error("Error:", error));

      const formworkUrl = new URL(
        `${urlPrefix.IP_port}/sub_building/floor_analysis_table/${props.buildingInfo.id}/formwork/filter`
      );
      formworkUrl.search = new URLSearchParams(params).toString();
      fetch(formworkUrl.toString(), {
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
        .then((response) => {
          const formworkJson = JSON.parse(response);
          const formworkJsonGrid: gridData = Object.entries(formworkJson).map(
            ([key, value]) => {
              const newObj: { [key: string]: any } = { "": key };
              for (const prop in value as Record<string, any>) {
                newObj[prop] = (value as Record<string, any>)[prop];
              }
              return newObj as { [key: string]: any } & { "": string };
            }
          );
          setFormworkData(formworkJsonGrid);
        })
        .catch((error) => console.error("Error:", error));

      const rebarUrl = new URL(
        `${urlPrefix.IP_port}/sub_building/floor_analysis_table/${props.buildingInfo.id}/rebar/filter`
      );
      rebarUrl.search = new URLSearchParams(params).toString();
      fetch(rebarUrl.toString(), {
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
        .then((response) => {
          const rebarJson: RebarJson[] = JSON.parse(response);
          const rebarJsonGrid: gridData = [];
          for (const rebar of rebarJson) {
            const floorName = rebar.floor_name;
            const rebarGrade = rebar.rebar_grade;
            const rebarDiameter = rebar.rebar_diameter;
            const totalRebar = rebar.total_rebar;

            const existingItem = rebarJsonGrid.find(
              (item) => item[""] === floorName
            );
            if (existingItem) {
              if (!existingItem[rebarGrade]) {
                existingItem[rebarGrade] = {};
              }
              existingItem[rebarGrade][rebarDiameter.toString()] = totalRebar;
            } else {
              const newItem = {
                "": floorName,
                [rebarGrade]: {
                  [rebarDiameter.toString()]: totalRebar,
                },
              };
              rebarJsonGrid.push(newItem);
            }
          }
          setRebarData(rebarJsonGrid);
        })
        .catch((error) => console.error("Error:", error));
    }
  }, [selectedComponentType]);

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

  const onTypeChange = React.useCallback(
    (e: RadioButtonChangeEvent) => {
      setSelectedType(e.value);
    },
    [setSelectedType]
  );

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
