import React, { useEffect, useState } from "react";
import axios from "axios";
import urlPrefix from "../../resource/URL_prefix.json";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { subBuildingInfo_interface } from "../../interface/subBuildingInfo_interface";
import { subBuildingAnalysisTable_interface } from "../../interface/subBuildingAnalysisTable_interface";

const SubBuildingTotalAnalysisTable = (props: any) => {
    const [selectedProject,setSelectedProject] = useState();
    const [subBuildingDetail, setSubBuildingDetail] = useState<subBuildingAnalysisTable_interface[]>();
    
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            urlPrefix.IP_port +
            "/sub_building/" +
            "/analysis_table/" +
            props.subBuildingInfo.id
          );
          
          const data = JSON.parse(response.data);
          setSubBuildingDetail(data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
  
      fetchData();
    }, [props]);
  
    const headerClassName = "custom-header-cell";
  
    return (
      <div>
        {subBuildingDetail && (
          <div>
            <Grid data={subBuildingDetail}>
              <GridColumn
                field="column1" // Replace with the actual field name
                title="건물명 구분" // Replace with the actual column title
                headerClassName={headerClassName}
              />
              <GridColumn
                field="total_concrete" // Replace with the actual field name
                title="건물 이름" // Replace with the actual column title
                headerClassName={headerClassName}
              />
              {/* Add more GridColumns for each desired column */}
            </Grid>
          </div>
        )}
      </div>
    );
  };
  

export default SubBuildingTotalAnalysisTable;
