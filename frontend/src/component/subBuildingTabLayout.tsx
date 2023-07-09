import React, { useState, useEffect } from "react";
import { Menu, MenuItem, MenuSelectEvent } from "@progress/kendo-react-layout";
import {
  useLocation,
  useNavigate,
  Outlet,
  Link,
  Navigate,
} from "react-router-dom";

import TotalAnalysisTab from "./SubBuildingComponent/totalAnalysis/TotalAnalysisTab";
import BuildingDetail from "./projectComponent/buildingDetail";
import AnalysisTab from "./SubBuildingComponent/analysis/analysisTab";
import FloorAnalysisTab from "./SubBuildingComponent/floorAnalysis/floorAnalysisTab";
import "./../styles/subBuildingTabLayout.scss";

const SubBuildingTabLayout = (props: any) => {
  const [selectedPage, setSelectedPage] = useState<string | undefined>("개요");


  const renderComponent = () => {
    switch (selectedPage) {
      case "개요":
        return (
          <BuildingDetail
            projectName={props.projectName}
            buildingInfo={props.buildingInfo}
            forAnalysisTab={true}
          />
        );
      case "총괄분석표":
        return (
          <TotalAnalysisTab
            buildingInfo={props.buildingInfo}
            projectName={props.projectName}
          ></TotalAnalysisTab>
        );
      case "분석표":
        return (
          <AnalysisTab
            buildingInfo={props.buildingInfo}
            projectName={props.projectName}
            >
          </AnalysisTab>
        );
      case "층별총집계표":
        return <FloorAnalysisTab
        buildingInfo={props.buildingInfo}
        projectName={props.projectName}></FloorAnalysisTab>
      default:
        return null;
    }
  };

  const onMenuSelect = (e: any) => {
    setSelectedPage(e.item.text);
  };

  const getMenuItemClassName = (text: string) => {
    return selectedPage === text ? "selected-menu-item" : "";
  };

  return (
    <div>
      <Menu onSelect={onMenuSelect}>
        <MenuItem
          text="개요"
          cssClass={getMenuItemClassName("개요")}
        />
        <MenuItem
          text="총괄분석표"
          cssClass={getMenuItemClassName("총괄분석표")}
        />
        <MenuItem
          text="분석표"
          cssClass={getMenuItemClassName("분석표")}
        />
        <MenuItem
          text="층별총집계표"
          cssClass={getMenuItemClassName("층별총집계표")}
        />
      </Menu>
      {renderComponent()}
    </div>
  );
};

export default SubBuildingTabLayout;
