import React, { useEffect, useState } from "react";
import axios from "axios";
import { Grid, GridColumn } from "@progress/kendo-react-grid";

import urlPrefix from "../../../resource/URL_prefix.json";

interface concreteDataI {
  component_type: string;
  material_name: string;
  total_concrete: number;
}
interface formworkDataI {
  component_type: string;
  formwork_type: string;
  total_formwork: number;
}
interface rebarDataI {
  component_type: string;
  rebar_grade: string;
  rebar_diameter: number;
  total_rebar: number;
}

const SubBuildingAnalysisTable = (props: any) => {
  

  return <div><Grid>
  <GridColumn/>
  <GridColumn/>
  <GridColumn/>
</Grid>  </div>;
};

export default SubBuildingAnalysisTable;
