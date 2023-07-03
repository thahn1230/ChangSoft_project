import React, { useState, useEffect } from "react";
import {
  Grid,
  GridColumn,
  getSelectedState,
  getSelectedStateFromKeyDown,
  GridFilterChangeEvent,
} from "@progress/kendo-react-grid";
import SubBuildingList from "../component/SubBuildingComponent/subBuildingList";
import SubBuildingTotalAnalysisTable1 from "../component/SubBuildingComponent/subBuildingTotalAnalysisTable1";
import SubBuildingTotalAnalysisTable3 from "./../component/SubBuildingComponent/subBuildingTotalAnalysisTable3"
import TotalAnalysisGrid2 from "./../component/SubBuildingComponent/analysisGrid";
import { subBuildingInfo_interface } from "../interface/subBuildingInfo_interface";

import { buildingInfo_interface } from "./../interface/buildingInfo_interface";
import { subBuildingTotalAnalysisTable1_interface } from "./../interface/subBuildingTotalAnalysisTable1_interface";
import { subBuildingTotalAnalysisTable2_interface } from "./../interface/subBuildingTotalAnalysisTable2_interface";

import axios from "axios";
import urlPrefix from "./../resource/URL_prefix.json";

const SubBuildingDetail = (props: any) => {
  const [buildingInfo, setBuildingInfo] = useState<
    buildingInfo_interface | undefined
  >();
  const [subBuildingInfo, setSubBuildingInfo] = useState<
    subBuildingInfo_interface[]
  >([]);
  const [selectedSubBuildingId, setSelectedSubBuildingId] = useState<number>(0);

  const [analysisTable1, setAnalysisTable1] =
    useState<subBuildingTotalAnalysisTable1_interface[]>();
  const [analysisTable1Grid, setAnalysisTable1Grid] = useState<
    { [key: string]: string | number }[]
  >([{}]);

  const [analysisTable2, setAnalysisTable2] =
    useState<subBuildingTotalAnalysisTable2_interface[]>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        //console.log("props.buildingInfo.id: ")
        //console.log(props.buildingInfo.id)
        setBuildingInfo(props.buildingInfo);

        //
      } catch (error) {
        console.error("Error fetching data:", error);
      }

    };

    fetchData();
  }, [props]);

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
  }, [buildingInfo]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedSubBuildingId]);

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

  return (
    <div className="sub-building-list">
      <SubBuildingList
        buildingInfo={buildingInfo}
        setSelectedSubBuildingId={setSelectedSubBuildingId}
      />

      <SubBuildingTotalAnalysisTable1
        endpoint={"total_analysis_table1/" + buildingInfo?.id}
        buildingInfo={buildingInfo}
        subBuildingInfo={subBuildingInfo}
        selectedSubBuildingId={selectedSubBuildingId}
      />
      <br />
      <br />
      <br />
      <TotalAnalysisGrid2 buildingId={buildingInfo?.id}></TotalAnalysisGrid2>

      <SubBuildingTotalAnalysisTable3 selectedSubBuildingId = {selectedSubBuildingId}></SubBuildingTotalAnalysisTable3>
    </div>
  );
};

export default SubBuildingDetail;
