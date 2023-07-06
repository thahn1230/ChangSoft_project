import React, { useState, useEffect } from "react";
import { Button } from "@progress/kendo-react-buttons";
import {
  useLocation,
  useNavigate,
  Outlet,
  Link,
  Routes,
  Route,
} from "react-router-dom";
import SubBuildingTabLayout from "./../component/subBuildingTabLayout";

const Analyses = () => {
  return (
    <div>
      <SubBuildingTabLayout>
      </SubBuildingTabLayout>
    </div>
  );
};

export default Analyses;
