import React, { useState, useEffect } from "react";
import {
  Grid,
  GridColumn,
  getSelectedState,
  getSelectedStateFromKeyDown,
  GridFilterChangeEvent,
} from "@progress/kendo-react-grid";
import {
  RadioButton,
  RadioButtonChangeEvent,
} from "@progress/kendo-react-inputs";
import { BrowserRouter } from "react-router-dom";
import SubBuildingList from "./SubBuildingList";
import SubBuildingTotalAnalysisTable1 from "./SubBuildingTotalAnalysisTable1";
import TotalAnalysisGrid2 from "./TotalAnalysisGrid2";
import SubBuildingTotalAnalysisPieChart from "./SubBuildingTotalAnalysisPieChart";
import SubBuildingTotalAnalysisBarChart from "./SubBuildingTotalAnalysisBarChart";

import { subBuildingInfo_interface } from "../../../interface/subBuildingInfo_interface";
import { buildingInfo_interface } from "../../../interface/buildingInfo_interface";
import { subBuildingTotalAnalysisTable1_interface } from "../../../interface/subBuildingTotalAnalysisTable1_interface";
import { subBuildingTotalAnalysisTable2_interface } from "../../../interface/subBuildingTotalAnalysisTable2_interface";
import { subBuildingAnalysisPercentage_interface } from "../../../interface/subBuildingAnalysisPercentage_interface";
import { subBuildingAnalysisValue_interface } from "../../../interface/subBuildingAnalysisValue_interface";

import axios from "axios";
import urlPrefix from "../../../resource/URL_prefix.json";
import "./../../../styles/SubBuildingDetail.scss";

import Analyses from "../../../pages/analyses";
import "./../../../styles/TotalAnalysisTab.scss";

const TotalAnalysisTab = (props: any) => {
  const [buildingInfo, setBuildingInfo] = useState<
    buildingInfo_interface | undefined
  >();
  const [subBuildingInfo, setSubBuildingInfo] = useState<
    subBuildingInfo_interface[]
  >([]);
  const [selectedSubBuildingId, setSelectedSubBuildingId] = useState<number>(-1);

  const [analysisTable1, setAnalysisTable1] =
    useState<subBuildingTotalAnalysisTable1_interface[]>();
  const [analysisTable1Grid, setAnalysisTable1Grid] = useState<
    { [key: string]: string | number }[]
  >([{}]);

  //콘크리트, 거푸집, 철근중에서 선택
  const [selectedType, setSelectedType] = useState("concrete");
  //각각의 퍼센트&타입
  const [percentagesInfo, setPercentagesInfo] =
    useState<subBuildingAnalysisPercentage_interface[]>();
  //각각의 값&타입
  const [valueInfo, setValueInfo] =
    useState<subBuildingAnalysisValue_interface[]>();

  useEffect(()=>{
    if(selectedSubBuildingId ===-1)
    setSelectedSubBuildingId(0)
  },[])

  useEffect(() => {
    const fetchData = async () => {
      try {
        //console.log("props.buildingInfo.id: ")
        //console.log(props.buildingInfo.id)
        setBuildingInfo(props.buildingInfo);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [props]);

  useEffect(() => {
    fetch(urlPrefix.IP_port + "/sub_building/" + props.buildingInfo.id, {
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
        const subBuildings = JSON.parse(response);
        setSubBuildingInfo(subBuildings);
        // const arrayData: ProjectsFloorCount[] = JSON.parse(data);
        // setTotalfloor(arrayData);
      })
      .catch((error) => console.error("Error:", error));
  }, [buildingInfo, props.buildingInfo]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get(
  //         urlPrefix.IP_port + "/sub_building/" + props.buildingInfo.id
  //       );

  //       const subBuildings = JSON.parse(response.data);
  //       setSubBuildingInfo(subBuildings);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   fetchData();
  // }, [buildingInfo, props.buildingInfo]);

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
      projectName: props.projectName,
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
          projectName={props.projectName}
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
