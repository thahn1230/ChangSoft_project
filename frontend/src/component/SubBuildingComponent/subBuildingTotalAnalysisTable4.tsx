import React, { useEffect, useState } from "react";
import {
  Grid,
  GridColumn,
  GridDetailRow,
  GridToolbar,
  GridDetailRowProps,
  GridDataStateChangeEvent,
  GridExpandChangeEvent,
} from "@progress/kendo-react-grid";

import { subBuildingTotalAnalysisTable2_interface } from "./../../interface/subBuildingTotalAnalysisTable2_interface";

import axios from "axios";
import urlPrefix from "../../resource/URL_prefix.json";

const SubBuildingAnalysisTable4 = (props: any) => {
  const [selectedSubBUildingId, setSelectedSubBUildingId] = useState<number>(0);
  const [selectedSubBuildingInfo, setSelectedSubBuildingInfo] =
    useState<subBuildingTotalAnalysisTable2_interface[]>();

  const [returnDiv, setReturnDiv] = useState(<div></div>);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setSelectedSubBUildingId(props.selectedSubBuildingId);
        setSelectedSubBuildingInfo(props.subBuildingInfo);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [props]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          urlPrefix.IP_port +
            "/sub_building/total_analysis_table/2/" +
            selectedSubBUildingId
        );
        const data = JSON.parse(response.data);
        setSelectedSubBuildingInfo(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [selectedSubBUildingId]);

  useEffect(() => {
    if (
      typeof selectedSubBUildingId === "number" &&
      selectedSubBUildingId !== 0
    ) {
      setReturnDiv(
        <div>
          {selectedSubBuildingInfo && (
            <div className="table-container">
              <Grid data={selectedSubBuildingInfo}>
                <GridColumn
                  title="구분"
                  field="component_type"
                  width={"100%"}
                  headerClassName="custom-header-cell"
                />
                <GridColumn
                  title="콘크리트(m³)"
                  field="concrete_volume"
                  width={"115%"}
                  headerClassName="custom-header-cell"
                />
                <GridColumn
                  title="콘크리트(%)"
                  field="concrete_percentage"
                  headerClassName="custom-header-cell"
                />
                <GridColumn
                  title="거푸집(㎡)"
                  field="formwork_area"
                  headerClassName="custom-header-cell"
                />
                <GridColumn
                  title="거푸집(%)"
                  field="formwork_percentage"
                  headerClassName="custom-header-cell"
                />
                <GridColumn
                  title="철근(Ton)"
                  field="rebar_weight"
                  headerClassName="custom-header-cell"
                />
                <GridColumn
                  title="철근(%)"
                  field="rebar_percentage"
                  headerClassName="custom-header-cell"
                />
              </Grid>
            </div>
          )}
        </div>
      );
    }
  }, [selectedSubBuildingInfo]);

  return returnDiv;
};

export default SubBuildingAnalysisTable4;
