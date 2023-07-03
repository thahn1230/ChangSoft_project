import React, { useEffect, useState } from "react";
import { Grid, GridColumn } from "@progress/kendo-react-grid";

import { subBuildingTotalAnalysisTable1_interface } from "./../../interface/subBuildingTotalAnalysisTable1_interface";
import { subBuildingInfo_interface } from "./../../interface/subBuildingInfo_interface";

import axios from "axios";
import urlPrefix from "../../resource/URL_prefix.json";
import "./../../styles/subBuildingTotalAnalysisTable.scss";

const SubBuildingAnalysisTable3 = (props: any) => {
  const [selectedSubBuildingId, setSelectedSubBuildingId] = useState<number>(0);
  const [returnDiv, setReturnDiv] = useState(<div></div>);

  const [subBuildingInfo, setSubBuildingInfo] =
    useState<subBuildingInfo_interface[]>();
  const [selectedSubBuildingInfo , setSelectedSubBuildingInfo] =useState<subBuildingInfo_interface>();

  const [analysisTable1, setAnalysisTable1] =
    useState<subBuildingTotalAnalysisTable1_interface[]>();
  const [analysisTable1Grid, setAnalysisTable1Grid] = useState<
    { [key: string]: string | number }[]
  >([{}]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setSubBuildingInfo(props.subBuildingInfo);  
        setSelectedSubBuildingId(props.selectedSubBuildingId);

        const selectedSubBuilding = subBuildingInfo?.find(obj => obj.id===selectedSubBuildingId)
        setSelectedSubBuildingInfo(selectedSubBuilding)

        console.log(props)
        //console.log(subBuildingInfo)
       // console.log(selectedSubBuildingInfo?.sub_building_name)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [props]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response1 = await axios.get(
          urlPrefix.IP_port +
            "/sub_building/analysis_table1/" +
            selectedSubBuildingId
        );

        setAnalysisTable1(JSON.parse(response1.data));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [selectedSubBuildingId]);

  useEffect(() => {
    const fetchData = async () => {
        console.log("return val will be changed")
      try {
        if (
          typeof selectedSubBuildingId === "number" &&
          selectedSubBuildingId !== 0
        ) {
          setReturnDiv(
            <div>
              {analysisTable1 && analysisTable1[0] && (
                <Grid data={analysisTable1Grid} style={{width: "50%"}}>
                  <GridColumn
                    title="건물명 구분"
                    headerClassName="custom-header-cell"
                  >
                    <GridColumn
                      title={selectedSubBuildingInfo?.sub_building_name}
                    ></GridColumn>
                    <GridColumn width="0px" />
                  </GridColumn>

                  <GridColumn
                    title="연면적"
                    headerClassName="custom-header-cell"
                  >
                    <GridColumn title={" / "}></GridColumn>
                    <GridColumn width={"0px"}></GridColumn>
                  </GridColumn>
                </Grid>
              )}

              {analysisTable1Grid &&
                analysisTable1Grid.length > 0 &&
                analysisTable1 &&
                analysisTable1[0] && (
                  <Grid data={analysisTable1Grid} style={{width: "50%"}}>
                    <GridColumn
                      title={"구분"}
                      field={"구분"}
                      headerClassName="custom-header-cell"
                    ></GridColumn>
                    <GridColumn
                      title={"콘크리트(㎥)"}
                      field={"콘크리트(㎥)"}
                      headerClassName="custom-header-cell"
                    ></GridColumn>

                    <GridColumn
                      title={"거푸집(㎡)"}
                      field={"거푸집"}
                      headerClassName="custom-header-cell"
                    ></GridColumn>
                    <GridColumn
                      title={"철근(Ton)"}
                      field={"철근(Ton)"}
                      headerClassName="custom-header-cell"
                    ></GridColumn>
                  </Grid>
                )}
            </div>
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [analysisTable1Grid]);


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

  return returnDiv;
};

export default SubBuildingAnalysisTable3;
