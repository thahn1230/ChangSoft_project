import React, { useState, useEffect } from "react";
import { Menu, MenuItem, MenuSelectEvent } from "@progress/kendo-react-layout";
import { Button } from "@progress/kendo-react-buttons";
import {
  useLocation,
  useNavigate,
  Outlet,
  Link,
  Navigate,
} from "react-router-dom";

import TotalAnalysisTab from "./SubBuildingComponent/totalAnalysis/TotalAnalysisTab";
import BuildingDetail from "./projectComponent/buildingDetail";

const SubBuildingTabLayout = (props: any) => {
  const [selectedPage, setSelectedPage] = useState<string | undefined>("개요");

  const renderComponent = () => {
    switch (selectedPage) {
      case "개요":
        return (<BuildingDetail projectName = {props.projectName} buildingInfo={props.buildingInfo} forAnalysisTab={true}/>);
      case "총괄분석표":
        return (
          <TotalAnalysisTab
            buildingInfo={props.buildingInfo}
            projectName={props.projectName}
          ></TotalAnalysisTab>
        );
      case "분석표":
        return <div>ccc</div>;
      case "층별총집계표":
        return <div>ddd</div>;
      default:
        return null;
    }
  };

  const onMenuSelect = (e:any)=>{
    //e.item.disabled =true;
    setSelectedPage(e.item.text);
  }
  return (
    <div>
      <Menu onSelect={onMenuSelect}>
        <MenuItem text="개요"  disabled={selectedPage === '개요'}/>
        <MenuItem text="총괄분석표" disabled={selectedPage === '총괄분석표'} />
        <MenuItem text="분석표"  disabled={selectedPage === '분석표'}/>
        <MenuItem text="층별총집계표"  disabled={selectedPage === '층별총집계표'}/>
      </Menu>
      {renderComponent()}
    </div>
  );
};

export default SubBuildingTabLayout;
