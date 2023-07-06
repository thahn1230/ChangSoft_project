import React, { useState, useEffect } from "react";
import { Button } from "@progress/kendo-react-buttons";
import { useLocation, useNavigate, Outlet,Link  } from "react-router-dom";

interface MenuItem {
  text: string;
  selected: boolean;
  route: string;
}

const items: MenuItem[] = [
  {
    text: "개요",
    selected: true,
    route: "/sub_building_detail/개요"
  },
  {
    text: "총괄분석표",
    selected: false,
    route: "/sub_building_detail/총괄분석표"
  },
  {
    text: "분석표",
    selected: false,
    route: "/sub_building_detail/분석표"
  },
  {
    text: "층별분석표",
    selected: false,
    route: "/sub_building_detail/층별분석표"
  },
];

const SubBuildingTabLayout = (props: any) => {

  return (
    <div>
       <nav className="wrapper">
      {/* 하단 네비게이션 최상위 태그 */}
      <div>
        <Link to="/first" className="nav-link">
        </Link>
      </div>
      <div>
        <Link to="/second" className="nav-link">
        </Link>
      </div>
      <div>
        <Link to="/third" className="nav-link">
        </Link>
      </div>
      <div>
        <Link to="/fourth" className="nav-link">
        </Link>
      </div>
      <div>
        <Link to="/fifth" className="nav-link">
        </Link>
      </div>
    </nav>

    </div>
  );
};

export default SubBuildingTabLayout;