import React, { useEffect, useState } from "react";
import axios from "axios";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import SubBuildingFloorAnalysisTable from "./subBuildingFloorAnalysisTable";

import SubBuildingAnalysisGraph from "../analysis/subBuildingAnalysisGraph";
import SubBuildingAnalysisTableSingleCol from "../analysis/subBuildingAnalysisTable_singleCol";
import SubBuildingAnalysisTableSubCol from "../analysis/subBuildingAnalysisTable_subCol";

import {
  Splitter,
  SplitterBar,
  SplitterOnChangeEvent,
} from "@progress/kendo-react-layout";

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

  const [panes, setPanes] = React.useState<Array<any>>([
    { size: "60%", min: "20px", collapsible: true, scrollable: false },
    { scrollable: false },
  ]);
  const [concretePanes, setConcretePanes] = React.useState<Array<any>>([
    { size: "40%", min: "20px", collapsible: true, scrollable: false },
    { scrollable: false },
  ]);
  const [formworkPanes, setFormworkPanes] = React.useState<Array<any>>([
    { size: "40%", min: "20px", collapsible: true, scrollable: false },
    { scrollable: false },
  ]);
  const [rebarPanes, setRebarPanes] = React.useState<Array<any>>([
    { size: "40%", min: "20px", collapsible: true, scrollable: false },
    { scrollable: false },
  ]);
  const onConcretePaneChange = (event: SplitterOnChangeEvent) => {
    setConcretePanes(event.newState);
  };
  const onFormworkPaneChange = (event: SplitterOnChangeEvent) => {
    setFormworkPanes(event.newState);
  };
  const onRebarPaneChange = (event: SplitterOnChangeEvent) => {
    setRebarPanes(event.newState);
  };

  const onChange = (event: SplitterOnChangeEvent) => {
    setPanes(event.newState);
  };

  useEffect(() => {
    const fetchData = async () => {
      let concreteResponse;
      let formworkResponse;
      let rebarResponse;

      try {
        concreteResponse = await axios.get(
          urlPrefix.IP_port +
            "/sub_building/floor_analysis_table/" +
            props.buildingInfo.id +
            "/concrete"
        );
        formworkResponse = await axios.get(
          urlPrefix.IP_port +
            "/sub_building/floor_analysis_table/" +
            props.buildingInfo.id +
            "/formwork"
        );
        rebarResponse = await axios.get(
          urlPrefix.IP_port +
            "/sub_building/floor_analysis_table/" +
            props.buildingInfo.id +
            "/rebar"
        );

        const concreteJson = JSON.parse(concreteResponse.data);
        const formworkJson = JSON.parse(formworkResponse.data);
        const rebarJson: RebarJson[] = JSON.parse(rebarResponse.data);

        const concreteJsonGrid: gridData = Object.entries(concreteJson).map(
          ([key, value]) => {
            const newObj: { [key: string]: any } = { "": key };
            for (const prop in value as Record<string, any>) {
              newObj[prop] = (value as Record<string, any>)[prop];
            }
            return newObj as { [key: string]: any } & { "": string };
          }
        );
        const formworkJsonGrid: gridData = Object.entries(formworkJson).map(
          ([key, value]) => {
            const newObj: { [key: string]: any } = { "": key };
            for (const prop in value as Record<string, any>) {
              newObj[prop] = (value as Record<string, any>)[prop];
            }
            return newObj as { [key: string]: any } & { "": string };
          }
        );

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

        setConcreteData(concreteJsonGrid);
        setFormworkData(formworkJsonGrid);
        setRebarData(rebarJsonGrid);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [props.buildingInfo]);

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

    let allSubKeys= new Set<string>();
    nonSubKeyData.map((item)=>{
        for(const key of Object.keys(item))
        {
          if(key !== "")
          allSubKeys.add(key)
        }
    })
    nonSubKeyData = nonSubKeyData.map((item: any) => {
      const newObj: { [key: string]: any } = {};
      newObj[""] = item[""];
    
      for (const key of Array.from(allSubKeys)) {
        newObj[key] = item[key] === undefined ? null :  item[key];
      }
    
      return newObj;
    });

    console.log(nonSubKeyData)
    setRebarDataNonSubKey(nonSubKeyData as gridData);
  }, [rebarData]);

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

      <div className="analysis-table-chart-container">
        {/* <Splitter panes={panes} onChange={onChange}>
          <div className="analysis-table-container">
            <SubBuildingFloorAnalysisTable
              concreteData={concreteData}
              formworkData={formworkData}
              rebarData={rebarData}
              rebarColumns={rebarColumns}
            ></SubBuildingFloorAnalysisTable>
          </div>
          <div className="analysis-chart-container">Graph</div>
        </Splitter> */}

        <Splitter panes={concretePanes} onChange={onConcretePaneChange}>
          <div>
            <SubBuildingAnalysisTableSingleCol
              data={concreteData}
              componentType={"콘크리트(㎥)"}
            ></SubBuildingAnalysisTableSingleCol>
          </div>
          <div>
          <SubBuildingAnalysisGraph
              data={concreteData}
              componentType={"Concrete"}
            ></SubBuildingAnalysisGraph>

          </div>
        </Splitter>
        <Splitter panes={formworkPanes} onChange={onFormworkPaneChange}>
          <div>
            <SubBuildingAnalysisTableSingleCol
              data={formworkData}
              componentType={"거푸집(㎡)"}
            ></SubBuildingAnalysisTableSingleCol>
          </div>
          <div>
          <SubBuildingAnalysisGraph
              data={formworkData}
              componentType={"Formwork"}
            ></SubBuildingAnalysisGraph>
          </div>
        </Splitter>
        <Splitter panes={rebarPanes} onChange={onRebarPaneChange}>
          <div>
            <SubBuildingAnalysisTableSubCol
              data={rebarData}
              componentType={"철근(Ton)"}
              columns={rebarColumns}
            ></SubBuildingAnalysisTableSubCol>
          </div>
          <div>
          <SubBuildingAnalysisGraph
              data={rebarDataNonSubKey}
              componentType={"Rebar"}
            ></SubBuildingAnalysisGraph>
          </div>
        </Splitter>
      </div>
    </div>
  );
};

export default FloorAnalysisTab;
