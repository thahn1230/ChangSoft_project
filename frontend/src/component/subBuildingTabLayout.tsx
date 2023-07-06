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

const SubBuildingTabLayout = (props: any) => {
  const [selectedPage, setSelectedPage] = useState<string | undefined>("");

  const renderComponent = () => {
    switch (selectedPage) {
      case "개요":
        return <div>bbb</div>;
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

  return (
    <div>
      <Menu onSelect={(e) => setSelectedPage(e.item.text)}>
        <MenuItem text="개요" />
        <MenuItem text="총괄분석표" />
        <MenuItem text="분석표" />
        <MenuItem text="층별총집계표" />
      </Menu>
      {renderComponent()}
    </div>
  );
};

export default SubBuildingTabLayout;
