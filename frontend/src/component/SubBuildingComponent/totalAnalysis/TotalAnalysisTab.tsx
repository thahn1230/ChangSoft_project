import React, { useState, useEffect } from "react";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import {
  RadioButton,
  RadioButtonChangeEvent,
} from "@progress/kendo-react-inputs";
import SubBuildingTotalAnalysisTable1 from "component/SubBuildingComponent/totalAnalysis/SubBuildingTotalAnalysisTable1";
import TotalAnalysisGrid2 from "component/SubBuildingComponent/totalAnalysis/TotalAnalysisGrid2";
import SubBuildingTotalAnalysisPieChart from "component/SubBuildingComponent/totalAnalysis/SubBuildingTotalAnalysisPieChart";
import SubBuildingTotalAnalysisBarChart from "component/SubBuildingComponent/totalAnalysis/SubBuildingTotalAnalysisBarChart";

import { SubBuildingInfo } from "interface/SubBuildingInterface";
import { SubBuildingTotalAnalysis1 } from "interface/SubBuildingInterface";
import { SubBuildingAnalysisPercentage } from "interface/SubBuildingInterface";
import { SubBuildingAnalysisValue } from "interface/SubBuildingInterface";
import { useProjectName, useBuildingInfo } from "App";

import { getSubBuildingInfo } from "services/subbuilding/subbuildingService";

import "styles/SubBuildingDetail.scss";
import "styles/TotalAnalysisTab.scss";

const TotalAnalysisTab = () => {
  const [buildingInfo, setBuildingInfo] = useBuildingInfo();
  const [projectName, setProjectName] = useProjectName();

  const [subBuildingInfo, setSubBuildingInfo] = useState<SubBuildingInfo[]>([]);
  const [selectedSubBuildingId, setSelectedSubBuildingId] =
    useState<number>(-1);

  const [analysisTable1, setAnalysisTable1] =
    useState<SubBuildingTotalAnalysis1[]>();
  const [analysisTable1Grid, setAnalysisTable1Grid] = useState<
    { [key: string]: string | number }[]
  >([{}]);

  //콘크리트, 거푸집, 철근중에서 선택
  const [selectedType, setSelectedType] = useState("concrete");
  //각각의 퍼센트&타입
  const [percentagesInfo, setPercentagesInfo] =
    useState<SubBuildingAnalysisPercentage[]>();
  //각각의 값&타입
  const [valueInfo, setValueInfo] = useState<SubBuildingAnalysisValue[]>();

  useEffect(() => {
    if (selectedSubBuildingId === -1) setSelectedSubBuildingId(0);
  }, []);

  useEffect(() => {
    if (buildingInfo?.id === undefined) return;
    
    getSubBuildingInfo(buildingInfo?.id).then((data) => {
      setSubBuildingInfo(data);
    });
  }, [buildingInfo, buildingInfo]);

  // "콘크리트(㎥)", "거푸집(㎡)", "철근(Ton)"
  useEffect(() => {
    if (analysisTable1) {
      let tableGrid = [];

      tableGrid.push({
        구분: "총물량",
        "콘크리트(㎥)": analysisTable1[0].total_concrete,
        거푸집: analysisTable1[0].total_formwork,
        "철근(Ton)": analysisTable1[0].total_rebar,
      });
      tableGrid.push({
        구분: "연면적",
        "콘크리트(㎥)": analysisTable1[0].con_floor_area_meter,
        거푸집: analysisTable1[0].form_floor_area_meter,
        "철근(Ton)": analysisTable1[0].reb_floor_area_meter,
      });
      tableGrid.push({
        구분: "평당/평",
        "콘크리트(㎥)": analysisTable1[0].con_floor_area_pyeong,
        거푸집: analysisTable1[0].form_floor_area_pyeong,
        "철근(Ton)": analysisTable1[0].reb_floor_area_pyeong,
      });
      tableGrid.push({
        구분: "콘크리트 m^당 값",
        "콘크리트(㎥)": "",
        거푸집: analysisTable1[0].form_con_result,
        "철근(Ton)": analysisTable1[0].reb_con_result,
      });
      setAnalysisTable1Grid(tableGrid);
    }
  }, [analysisTable1]);

  const onTypeChange = React.useCallback(
    (e: RadioButtonChangeEvent) => {
      setSelectedType(e.value);
    },
    [setSelectedType]
  );

  let data = [
    {
      projectName: projectName,
      building_name: buildingInfo?.building_name,
    },
  ];

  return (
    <div className="sub-building-list">
      <div className="left-components">
        <Grid data={data}>
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
        <SubBuildingTotalAnalysisTable1
          buildingInfo={buildingInfo}
          subBuildingInfo={subBuildingInfo}
          selectedSubBuildingId={selectedSubBuildingId}
          setSelectedSubBuildingId={setSelectedSubBuildingId}
          projectName={projectName}
        />
        <TotalAnalysisGrid2
          selectedBuildingId={buildingInfo?.id}
          selectedSubBuildingId={selectedSubBuildingId}
          selectedType={selectedType}
          setValueInfo={setValueInfo}
          setPercentagesInfo={setPercentagesInfo}
        ></TotalAnalysisGrid2>
      </div>

      <div className="right-components">
        <div className="total-analysis-button-container">
          <RadioButton
            value="concrete"
            checked={selectedType === "concrete"}
            label="콘크리트"
            onChange={onTypeChange}
            style={{ marginLeft: "10px" }}
            className="k-radio-button"
          />
          <RadioButton
            value="formwork"
            checked={selectedType === "formwork"}
            label="거푸집"
            onChange={onTypeChange}
            style={{ marginLeft: "10px" }}
            className="k-radio-button"
          />
          <RadioButton
            value="rebar"
            checked={selectedType === "rebar"}
            label="철근"
            onChange={onTypeChange}
            style={{ marginLeft: "10px" }}
            className="k-radio-button"
          />
        </div>
        <div className="bar-pie-chart-container">
          <SubBuildingTotalAnalysisBarChart
            valueInfo={valueInfo}
            selectedType={selectedType}
          ></SubBuildingTotalAnalysisBarChart>

          <SubBuildingTotalAnalysisPieChart
            percentagesInfo={percentagesInfo}
            selectedType={selectedType}
            selectedSubBuildingId={selectedSubBuildingId}
          ></SubBuildingTotalAnalysisPieChart>
        </div>
      </div>
    </div>
  );
};

export default TotalAnalysisTab;
