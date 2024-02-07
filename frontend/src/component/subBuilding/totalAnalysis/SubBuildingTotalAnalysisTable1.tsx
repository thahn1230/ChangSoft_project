import React, { useEffect, useState } from "react";
import { Grid, GridColumn } from "@progress/kendo-react-grid";

import SubBuildingList from "component/subBuilding/totalAnalysis/SubBuildingList";

import { SubBuildingTotalAnalysis1 } from "interface/SubBuildingInterface";
import "styles/subBuildingTotalAnalysisTable.scss";

const SubBuildingTotalAnalysisTable1 = (props: any) => {
  const [selectedSubBuildingId, setSelectedSubBuildingId] = useState<number>();

  const [analysisTable1, setAnalysisTable1] =
    useState<SubBuildingTotalAnalysis1[]>();
  const [analysisTable1Grid, setAnalysisTable1Grid] = useState<
    { [key: string]: string | number }[]
  >([{}]);

  // useEffect(() => {
  //   console.log(selectedSubBuildingId);
  // }, []);

  //여기서 internal server error
  useEffect(() => {
    fetch(
      `${process.env.REACT_APP_API_URL}/sub_building/total_analysis_table_all/1/${props.buildingInfo?.id}`,
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
        setAnalysisTable1(JSON.parse(response));
        // const arrayData: ProjectsFloorCount[] = JSON.parse(data);
        // setTotalfloor(arrayData);
      })
      .catch((error) => console.error("Error:", error));
  }, [props.buildingInfo]);

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

  useEffect(() => {
    console.log("??")
    if (selectedSubBuildingId === -1) return;
    props.setSelectedSubBuildingId(selectedSubBuildingId);

    if (selectedSubBuildingId === undefined) return;

    let url;

    if (selectedSubBuildingId === 0) {
      url = `${process.env.REACT_APP_API_URL}/sub_building/total_analysis_table_all/1/${props.buildingInfo?.id}`;
    } else {
      url = `${process.env.REACT_APP_API_URL}/sub_building/total_analysis_table/1/${selectedSubBuildingId}`;
    }

    fetch(url, {
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
        // const arrayData: ProjectsFloorCount[] = JSON.parse(data);
        // setTotalfloor(arrayData);
        setAnalysisTable1(JSON.parse(response));
      })
      .catch((error) => console.error("Error:", error));
  }, [selectedSubBuildingId, props.buildingInfo?.id]);

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
                    projectName={props.projectName}
                    setSelectedSubBuildingId={setSelectedSubBuildingId}
                    selectedSubBuildingId={selectedSubBuildingId}
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
                  {analysisTable1 &&
                  analysisTable1[0] &&
                  analysisTable1[0].total_floor_area_meter !== undefined &&
                  analysisTable1[0].total_floor_area_pyeong !== undefined
                    ? analysisTable1[0].total_floor_area_meter.toFixed(2) +
                      "㎥ / " +
                      analysisTable1[0].total_floor_area_pyeong.toFixed(2) +
                      "평"
                    : null}
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
