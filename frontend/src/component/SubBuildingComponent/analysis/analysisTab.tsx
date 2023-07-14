import React, { useState, useEffect } from "react";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import SubBuildingList from "./subBuildingList";

import {
  Splitter,
  SplitterBar,
  SplitterOnChangeEvent,
} from "@progress/kendo-react-layout";
import axios from "axios";
import urlPrefix from "../../../resource/URL_prefix.json";
import SubBuildingAnalysisTable from "./subBuildingAnalysisTable";
import "./../../../styles/analysisTab.scss";
import SubBuildingAnalysisGraph from "./SubBuildingAnalysisGraph";

import { subBuildingInfo_interface } from "../../../interface/subBuildingInfo_interface";

interface ConcreteJson {
  component_type: string;
  material_name: string;
  total_volume: number;
}
interface FormworkJson {
  component_type: string;
  formwork_type: string;
  total_area: number;
}
interface RebarJson {
  component_type: string;
  rebar_grade: string;
  rebar_diameter: number;
  total_weight: number;
}

type gridData = Array<{ [key: string]: any } & { "": string }>;

const AnalysisTab = (props: any) => {
  const [selectedSubBuildingId, setSelectedSubBuildingId] = useState(0);

  const [subBuildingInfo, setSubBuildingInfo] = useState<
    subBuildingInfo_interface[]
  >([]);
  const [graphDataConcrete, setGraphDataConcrete] = useState<ConcreteJson[]>(
    []
  );
  const [graphDataFormwork, setGraphDataFormwork] = useState<FormworkJson[]>(
    []
  );
  const [graphDataRebar, setGraphDataRebar] = useState<RebarJson[]>([]);

  const [concreteData, setConcreteData] = useState<gridData>([]);
  const [formworkData, setFormworkData] = useState<gridData>([]);
  const [rebarData, setRebarData] = useState<gridData>([]);
  const [rebarColumns, setRebarColumns] = useState<{}[]>();

  let headerData = [
    {
      projectName: props.projectName,
      building_name: props.buildingInfo?.building_name,
    },
  ];

  const [panes, setPanes] = React.useState<Array<any>>([
    { size: "60%", min: "20px", collapsible: true, scrollable: false },
    { scrollable: false },
  ]);
  const onChange = (event: SplitterOnChangeEvent) => {
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

        setGraphDataConcrete(concreteJson);
        setGraphDataFormwork(formworkJson);
        setGraphDataRebar(rebarJson);

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
  }, [rebarData]);

  const groupedDataConcrete = graphDataConcrete.reduce(
    (acc: any, item: ConcreteJson) => {
      const { component_type, material_name, total_volume } = item;
      const key = `${component_type}-${material_name}`;

      if (acc[key]) {
        acc[key].total_volume += total_volume;
      } else {
        acc[key] = {
          component_type,
          material_name,
          total_volume,
        };
      }

      return acc;
    },
    {}
  );

  const groupedDataFormwork = graphDataFormwork.reduce(
    (acc: any, item: FormworkJson) => {
      const { component_type, formwork_type, total_area } = item;
      const key = `${component_type}-${formwork_type}`;

      if (acc[key]) {
        acc[key].total_area += total_area;
      } else {
        acc[key] = {
          component_type,
          formwork_type,
          total_area,
        };
      }

      return acc;
    },
    {}
  );

  const groupedDataRebar = graphDataRebar.reduce(
    (acc: any, item: RebarJson) => {
      const { component_type, rebar_grade, total_weight } = item;
      const key = `${component_type}-${rebar_grade}`;

      if (acc[key]) {
        acc[key].total_weight += total_weight;
      } else {
        acc[key] = {
          component_type,
          rebar_grade,
          total_weight,
        };
      }

      return acc;
    },
    {}
  );

  // 그룹화된데이터를 배열로 변환

  const groupedChartDataConcrete = Object.values(groupedDataConcrete);
  const groupedChartDataFormwork = Object.values(groupedDataFormwork);
  const groupedChartDataRebar = Object.values(groupedDataRebar);

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

      <div className="analysis-table-chart-container">
        <Splitter panes={panes} onChange={onChange}>
          <div className="analysis-table-container">
            <SubBuildingAnalysisTable
              concreteData={concreteData}
              formworkData={formworkData}
              rebarData={rebarData}
              rebarColumns={rebarColumns}
            ></SubBuildingAnalysisTable>
          </div>
          <div className="analysis-chart-container">
            {/* <SubBuildingAnalysisGraph
              groupedChartDataConcrete={groupedChartDataConcrete}
              groupedChartDataFormwork={groupedChartDataFormwork}
              groupedChartDataRebar={groupedChartDataRebar}
            ></SubBuildingAnalysisGraph> */}
            
            
            
            <SubBuildingAnalysisGraph
              data={groupedChartDataConcrete}
              componentType={"Concrete"}
            ></SubBuildingAnalysisGraph>


            <SubBuildingAnalysisGraph
              data={groupedChartDataFormwork}
              componentType={"Formwork"}
            ></SubBuildingAnalysisGraph>

            
            <SubBuildingAnalysisGraph
              data={groupedChartDataRebar}
              componentType={"Rebar"}
            ></SubBuildingAnalysisGraph>

          </div>
        </Splitter>
      </div>
    </div>
  );
};

export default AnalysisTab;
