import React, { useEffect, useState } from "react";
import axios from "axios";
import urlPrefix from "../../../resource/URL_prefix.json";
import { Grid, GridColumn } from "@progress/kendo-react-grid";

import SubBuildingList from "./subBuildingList";

import { subBuildingInfo_interface } from "../../../interface/subBuildingInfo_interface";
import { subBuildingAnalysisTable_interface } from "../../../interface/subBuildingAnalysisTable_interface";
import { buildingInfo_interface } from "./../../../interface/buildingInfo_interface";
import { subBuildingTotalAnalysisTable1_interface } from "./../../../interface/subBuildingTotalAnalysisTable1_interface";
import "./../../../styles/subBuildingTotalAnalysisTable.scss";

const SubBuildingTotalAnalysisTable1 = (props: any) => {
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // console.log(props)
        setBuildingInfo(props.buildingInfo);
        setSubBuildingInfo(props.subBuildingInfo);
        setSelectedSubBuildingId(props.selectedSubBuildingId);

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
            "/sub_building/total_analysis_table_all/1/" +
            props.buildingInfo?.id
        );

        setAnalysisTable1(JSON.parse(response1.data));
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
        구분: "콘크리트 1㎥당 값",
        "콘크리트(㎥)": "",
        거푸집: analysisTable1[0].form_con_result,
        "철근(Ton)": analysisTable1[0].reb_con_result,
      });
      setAnalysisTable1Grid(tableGrid);
    }
  }, [analysisTable1]);

  //여기에서 테이블 갈아엎어야함
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (selectedSubBuildingId === undefined) return;

        props.setSelectedSubBuildingId(selectedSubBuildingId);

        let response;
        if (selectedSubBuildingId === 0) {
          response = await axios.get(
            urlPrefix.IP_port +
              "/sub_building/total_analysis_table_all/1/" +
              buildingInfo?.id
          );
        } else {
          response = await axios.get(
            urlPrefix.IP_port +
              "/sub_building/total_analysis_table/1/" +
              selectedSubBuildingId
          );
        }
        setAnalysisTable1(JSON.parse(response.data));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedSubBuildingId]);

  return (
    <div className="table-container">
      {analysisTable1 && analysisTable1[0] && (
        <Grid data={analysisTable1Grid}>
          <GridColumn title="건물명 구분" headerClassName="custom-header-cell">
            <GridColumn
              headerCell={() => (
                <div>
                  <SubBuildingList
                    buildingInfo={props.buildingInfo}
                    setSelectedSubBuildingId={setSelectedSubBuildingId}
                    selectedSubBuildingId={selectedSubBuildingId}
                    projectName={props.projectName}
                    selectedSubBuildingName={
                      props.selectedSubBuildingInfo?.sub_building_name
                    }
                    subBuildingInfo={props.subBuildingInfo}
                  />
                </div>
              )}
            />
            <GridColumn width="0px" />
          </GridColumn>

          <GridColumn title="연면적" headerClassName="custom-header-cell">
            <GridColumn
              headerCell={() => (
                <div className="custom-header-number-cell">
                  {analysisTable1[0].total_floor_area_meter +
                    "㎥ / " +
                    analysisTable1[0].total_floor_area_pyeong +
                    "평"}
                </div>
              )}
            ></GridColumn>
            <GridColumn width={"0px"}></GridColumn>
          </GridColumn>
        </Grid>
      )}

      {analysisTable1Grid &&
        analysisTable1Grid.length > 0 &&
        analysisTable1 &&
        analysisTable1[0] && (
          <Grid data={analysisTable1Grid}>
            <GridColumn
              title={"구분"}
              field={"구분"}
              headerClassName="custom-header-cell"
              className="custom-text-cell"
            ></GridColumn>
            <GridColumn
              title={"콘크리트(㎥)"}
              field={"콘크리트(㎥)"}
              headerClassName="custom-header-cell"
              className="custom-number-cell"
              format={"{0:n2}"}
            ></GridColumn>

            <GridColumn
              title={"거푸집(㎡)"}
              field={"거푸집"}
              headerClassName="custom-header-cell"
              className="custom-number-cell"
              format={"{0:n2}"}
            ></GridColumn>
            <GridColumn
              title={"철근(Ton)"}
              field={"철근(Ton)"}
              headerClassName="custom-header-cell"
              className="custom-number-cell"
              format={"{0:n2}"}
            ></GridColumn>
          </Grid>
        )}
    </div>
  );
};

export default SubBuildingTotalAnalysisTable1;
