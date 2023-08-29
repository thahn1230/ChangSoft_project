import React, { useState, useEffect } from "react";
import {
  Grid,
  GridColumn,
  getSelectedState,
  getSelectedStateFromKeyDown,
  GridToolbar,
} from "@progress/kendo-react-grid";
import { Button } from "@progress/kendo-react-buttons";
import axios from "axios";
import urlPrefix from "./../../resource/URL_prefix.json";
import { useNavigate, Route, Routes } from "react-router-dom";
import { buildingInfo_interface } from "./../../interface/buildingInfo_interface";
import SubBuildingDetail from "../SubBuildingComponent/totalAnalysis/SubBuildingList";

import "./../../styles/GridDetail.scss";

const BuildingDetail = (props: any) => {
  const [returnDiv, setReturnDiv] = useState(<div></div>);
  const [imgPath, setImgPath] = useState<string>("");
  const [buildingInfo, setBuildingInfo] = useState<
    buildingInfo_interface | undefined
  >();

  useEffect(() => {
    fetch(urlPrefix.IP_port +
      "/building/" +
      props.buildingInfo.id +
      "/get_project_name", {
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
      .then(async (response) => {
        const data = JSON.parse(response);
          const importedImagePath = await import(
          "./../../resource/project_pictures/" +
            data[0].project_name +
            "/" +
            data[0].building_name +
            "/ScreenShot.png"
        );
        setBuildingInfo(props.buildingInfo);
        setImgPath(importedImagePath.default);
      })
      .catch((error) => console.error("Error:", error));
  }, [props, imgPath]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get(
  //         urlPrefix.IP_port +
  //           "/building/" +
  //           props.buildingInfo.id +
  //           "/get_project_name"
  //       );

  //       const data = JSON.parse(response.data);
  //       const importedImagePath = await import(
  //         "./../../resource/project_pictures/" +
  //           data[0].project_name +
  //           "/" +
  //           data[0].building_name +
  //           "/ScreenShot.png"
  //       );

  //       setBuildingInfo(props.buildingInfo);
  //       setImgPath(importedImagePath.default);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   fetchData();
  // }, [props, imgPath]);

  const navigate = useNavigate();
  const onClick = () => {
    navigate("/sub_building_detail");
  };

  const headerClassName = "custom-header-cell";

  return (
    <div>
      <div style={{ width: "30%", float: "left", paddingLeft: "1%" }}>
        {imgPath && <img src={imgPath} alt="Building Image" style={{ width: "163%", float: "left"}} />}
      </div>
      <div style={{ width: "50%", float: "right", paddingLeft: "1%" }}>
        {!props.forAnalysisTab && (
          <div>
            <Button
              onClick={onClick}
              style={{
                backgroundColor: "rgb(53, 53, 219)",
                color: "white",
                marginBottom: "10px",
                marginTop: "5px",
                width: "6vw",
                height: "4vh",
                marginLeft: "1%"
              }}
            >
              상세보기
            </Button>
          </div>
        )}
        <Grid data={[buildingInfo]}>
          <GridColumn
            field="building_name"
            title="빌딩 이름"
            headerClassName={headerClassName}
            className="custom-text-cell"
          />
        </Grid>
        <Grid data={[buildingInfo]}>
          <GridColumn
            field="total_area_square_meter"
            title="전체 면적(㎡)"
            headerClassName={headerClassName}
            className="custom-number-cell"
            format={"{0:n2}"}
          />
          <GridColumn
            field="stories_above_below"
            title="층수(지상/지하, 층)"
            headerClassName={headerClassName}
            className="custom-number-cell"
          />
          <GridColumn
            field="height_above_below"
            title="높이(지상/지하, m)"
            headerClassName={headerClassName}
            className="custom-number-cell"
          />
          <GridColumn
            field="construction_method"
            title="공법"
            headerClassName={headerClassName}
          />
        </Grid>

        <Grid data={[buildingInfo]}>
          <GridColumn
            field="top_down"
            title="탑다운"
            headerClassName={headerClassName}
          />
          <GridColumn
            field="plane_shape"
            title="평면현상"
            headerClassName={headerClassName}
          />
          <GridColumn
            field="foundation_type"
            title="기초타입"
            headerClassName={headerClassName}
          />
          <GridColumn
            field="structure_code"
            title="규준"
            headerClassName={headerClassName}
          />
          <GridColumn
            field="performance_design_target"
            title="내진설계"
            headerClassName={headerClassName}
          />
        </Grid>
      </div>
    </div>
  );
};

export default BuildingDetail;
