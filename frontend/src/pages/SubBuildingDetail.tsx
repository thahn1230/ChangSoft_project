import React, { useState, useEffect } from "react";
import {
  Grid,
  GridColumn,
  getSelectedState,
  getSelectedStateFromKeyDown,
  GridFilterChangeEvent,
} from "@progress/kendo-react-grid";
import SubBuildingList from "../component/SubBuildingComponent/subBuildingList";
import SubBuildingTotalAnalysisTable from "../component/SubBuildingComponent/subBuildingTotalAnalysisTable";
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
    subBuildingInfo_interface | undefined
  >();
  const [selectedSubBuildingId, setSelectedSubBuildingId] = useState<number>();

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
        setBuildingInfo(props.buildingInfo);

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
  }, [props]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setBuildingInfo(props.buildingInfo);

        const response1 = await axios.get(
          urlPrefix.IP_port +
            "/sub_building/total_analysis_table1/" +
            props.buildingInfo.id
        );
        const response2 = await axios.get(
          urlPrefix.IP_port +
            "/sub_building/total_analysis_table2/" +
            props.buildingInfo.id
        );

        setAnalysisTable1(JSON.parse(response1.data));
        setAnalysisTable2(JSON.parse(response2.data));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [buildingInfo]);

  // "콘크리트(㎥)", "거푸집(㎡)", "철근(Ton)"
  useEffect(() => {
    if (analysisTable1) {
      let tableGrid = [];

      tableGrid.push({
        구분: "총물량",
        "콘크리트(㎥)": analysisTable1[0].total_concrete.toFixed(2),
        거푸집: analysisTable1[0].total_formwork.toFixed(2),
        "철근(Ton)": analysisTable1[0].total_rebar.toFixed(2),
      });
      tableGrid.push({
        구분: "연면적",
        "콘크리트(㎥)": analysisTable1[0].con_floor_area_meter.toFixed(2),
        거푸집: analysisTable1[0].form_floor_area_meter.toFixed(2),
        "철근(Ton)": analysisTable1[0].reb_floor_area_meter.toFixed(2),
      });
      tableGrid.push({
        구분: "평당/평",
        "콘크리트(㎥)": analysisTable1[0].con_floor_area_pyeong.toFixed(2),
        거푸집: analysisTable1[0].form_floor_area_pyeong.toFixed(2),
        "철근(Ton)": analysisTable1[0].reb_floor_area_pyeong.toFixed(2),
      });
      tableGrid.push({
        구분: "콘크리트 m^당 값",
        "콘크리트(㎥)": "",
        거푸집: analysisTable1[0].form_con_result.toFixed(2),
        "철근(Ton)": analysisTable1[0].reb_con_result.toFixed(2),
      });
      console.log(tableGrid);
      setAnalysisTable1Grid(tableGrid);
    }
  }, [analysisTable1]);

  return (
    <div className="sub-building-list">
      <SubBuildingList
        buildingInfo={buildingInfo}
        setSelectedSubBuildingId={setSelectedSubBuildingId}
      />

      {analysisTable1 && analysisTable1[0] && (
        <Grid data={analysisTable1Grid}>
          <GridColumn title="건물명 구분">
            <GridColumn title={buildingInfo?.building_name}></GridColumn>
            <GridColumn width="0px" />
          </GridColumn>

            <GridColumn title="연면적">
              <GridColumn
                title={
                  analysisTable1[0].total_floor_area_meter.toString() + "㎥ / " +
                  analysisTable1[0].total_floor_area_pyeong.toString() + "평"
                }
              ></GridColumn>
              <GridColumn width ={"0px"}></GridColumn>
            </GridColumn>
        </Grid>
      )}

      {analysisTable1Grid &&
        analysisTable1Grid.length > 0 &&
        analysisTable1 &&
        analysisTable1[0] && (
          <Grid data={analysisTable1Grid}>
            <GridColumn title={"구분"} field={"구분"}></GridColumn>
            <GridColumn
              title={"콘크리트(㎥)"}
              field={"콘크리트(㎥)"}
            ></GridColumn>

            <GridColumn title={"거푸집(㎡)"} field={"거푸집"}></GridColumn>
            <GridColumn title={"철근(Ton)"} field={"철근(Ton)"}></GridColumn>
          </Grid>
        )}

      <div className="sub-building-detail">
        <SubBuildingTotalAnalysisTable
          buildingId={buildingInfo?.id}
          subBuildingInfo={subBuildingInfo}
          selectedSubBuildingId={selectedSubBuildingId}
        />
      </div>
    </div>
  );
};

export default SubBuildingDetail;
