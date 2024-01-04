import React, { useState } from "react";
import { Menu, MenuItem } from "@progress/kendo-react-layout";

import TotalAnalysisTab from "component/SubBuildingComponent/totalAnalysis/TotalAnalysisTab";
import BuildingDetail from "component/projectComponent/BuildingDetail";
import AnalysisTab from "component/SubBuildingComponent/analysis/AnalysisTab";
import FloorAnalysisTab from "component/SubBuildingComponent/floorAnalysis/FloorAnalysisTab";
import QuantityDetailTab from "component/SubBuildingComponent/quantityDetail/QuantityDetailTab";
import "styles/subBuildingTabLayout.scss";

const SubBuildingTabLayout = () => {
  const [selectedPage, setSelectedPage] = useState<string | undefined>("개요");

  const renderComponent = () => {
    switch (selectedPage) {
      case "개요":
        return (
          <BuildingDetail
            forAnalysisTab={true}
          />
        );
      case "총괄분석표":
        return (
          <TotalAnalysisTab/>
        );
      case "분석표":
        return (
          <AnalysisTab/>
        );
      case "층별총집계표":
        return (
          <FloorAnalysisTab/>
        );
      case "물량정보상세":
        return (
          <QuantityDetailTab/>
        );
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
        <MenuItem text="개요" cssClass={getMenuItemClassName("개요")} />
        <MenuItem
          text="총괄분석표"
          cssClass={getMenuItemClassName("총괄분석표")}
        />
        <MenuItem text="분석표" cssClass={getMenuItemClassName("분석표")} />
        <MenuItem
          text="층별총집계표"
          cssClass={getMenuItemClassName("층별총집계표")}
        />
        <MenuItem
          text="물량정보상세"
          cssClass={getMenuItemClassName("물량정보상세")}
        />
      </Menu>
      {renderComponent()}
    </div>
  );
};

export default SubBuildingTabLayout;
