import React, { useEffect, useState } from "react";
import axios from "axios";
import urlPrefix from "../../resource/URL_prefix.json";


const SubBuildingAnalysisTable3=(props:any)=>{
    const [selectedSubBuildingId, setSelectedSubBuildingId] = useState<number>(0);

    useEffect(() => {
        const fetchData = async () => {
          try {
            setSelectedSubBuildingId(props.selectedSubBuildingId)
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };
    
        fetchData();
      }, [props]);

      useEffect(() => {
        const fetchData = async () => {
          try {
           return (<div> {props.selectedSubBuildingId} 선택됨</div>)
            
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };
    
        fetchData();
      }, [selectedSubBuildingId]);

      return (<div> {props.selectedSubBuildingId} 선택됨</div>)
}

export default SubBuildingAnalysisTable3;