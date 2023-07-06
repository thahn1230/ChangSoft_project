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
  const [columns, setColumns] = useState<string[]>([]);
  const [concreteColumns, setConcreteColumns] = useState<string[]>([]);
  const [formworkColumns, setFormworkColumns] = useState<string[]>([]);
  const [rebarColumns, setRebarColumns] = useState([]);

  const [concreteData, setConcreteData] = useState<concreteDataI[]>([]);
  const [formworkData, setFormworkData] = useState<formworkDataI[]>([]);
  const [rebarData, setRebarData] = useState<rebarDataI[]>([]);

  const [selectedId, setSelectedId] = useState(0);
  const [selectedName, setSelectedName] = useState("전체동");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const concreteResponse = await axios.get(
          urlPrefix.IP_port + "/sub_building/analysis_table/" + 63 + "/concrete"
        );
        setConcreteData(JSON.parse(concreteResponse.data));

        const formworkResponse = await axios.get(
          urlPrefix.IP_port + "/sub_building/analysis_table/" + 63 + "/formwork"
        );
        setFormworkData(JSON.parse(formworkResponse.data));
        const rebarResponse = await axios.get(
          urlPrefix.IP_port + "/sub_building/analysis_table/" + 63 + "/rebar"
        );
        setRebarData(JSON.parse(rebarResponse.data));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [props]);

  useEffect(() => {
    setConcreteColumns(
      Array.from(new Set(concreteData.map((item) => item.material_name))).sort()
    );

    console.log(concreteColumns);
  }, [concreteData]);
  useEffect(() => {
    setFormworkColumns(
      Array.from(new Set(formworkData.map((item) => item.formwork_type))).sort()
    );

    console.log(formworkColumns);
  }, [formworkData]);
  useEffect(() => {

    const rebarObject: Record<string, Set<number>> = {};
    rebarData.forEach((item) => {
      const { rebar_grade, rebar_diameter } = item;
      if (!rebarObject[rebar_grade]) {
        rebarObject[rebar_grade] = new Set<number>();
      }
      rebarObject[rebar_grade].add(rebar_diameter);
    });
    
    //setRebarColumns(rebarObject);
    console.log(rebarObject);
  }, [rebarData]);

  return <div></div>;
};

export default SubBuildingAnalysisTable;
