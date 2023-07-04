import React, { useEffect, useState ,useRef} from "react";
import { DropDownList, ComboBox } from "@progress/kendo-react-dropdowns";
import {
  CompositeFilterDescriptor,
  filterBy,
  FilterDescriptor,
} from "@progress/kendo-data-query";
import axios from "axios";
import urlPrefix from "../../resource/URL_prefix.json";
import { projectList_interface } from "./../../interface/projectList_interface";
import { buildingInfo_interface } from "./../../interface/buildingInfo_interface";
import { subBuildingInfo_interface } from "../../interface/subBuildingInfo_interface";
import "./../../styles/SubBuildingList.scss";

const SubBuildingList = (props: any) => {
  const [subBuildinglist, setSubBuildinglist] = useState<string[]>([]);
  const [subBuildingInfo, setSubBuildingInfo] = useState<
    subBuildingInfo_interface[]
  >([]);
  const [selectedSubBuildingName, setSelectedSubBuildingName] =
    useState<string>("전체동");
  const [selectedSubBuildingId, setSelectedSubBuildingId] = useState<number|undefined>(0);

  const [selectedBuilding, setSelectedBuilding] =
    useState<buildingInfo_interface>();



  useEffect(() => {
    const fetchData = async () => {
      try {
        

        console.log("in list");
        let prevSelectedSubBuilding  = props.subBuildingInfo.find((subBuilding:any)=>subBuilding.id===props.selectedSubBuildingId)
        if(prevSelectedSubBuilding === undefined)
        {
          console.log("전체동 selected");
          setSelectedSubBuildingName("전체동")
        }
        else
        {
          console.log(prevSelectedSubBuilding.sub_building_name);
          setSelectedSubBuildingName(prevSelectedSubBuilding.sub_building_name)

        }


        setSelectedBuilding(props.buildingInfo);

        const response = await axios.get(
          urlPrefix.IP_port + "/sub_building/" + props.buildingInfo.id
        );
        const data: subBuildingInfo_interface[] = JSON.parse(response.data); // assuming the API response contains an array of buildings

        let subBuildingNames: string[] = [];
        subBuildingNames.push("전체동");
        for (let i = 0; i < data.length; i++) {
          subBuildingNames.push(data[i].sub_building_name);
        }
        /*
        setSubBuildinglist(
          data.map((obj: subBuildingInfo_interface) => obj.sub_building_name)
        );
        */
        setSubBuildingInfo(data);
        setSubBuildinglist(subBuildingNames);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [props]);

  /*
  useEffect(() => {
    const selectedSubId = subBuildingInfo.find(
      (item) => item.sub_building_name === selectedSubBuildingName
    )?.id;
    setSelectedSubBuildingId(selectedSubId);
  }, [selectedSubBuildingName]);

  useEffect(() => {
    props.setSelectedSubBuildingId(selectedSubBuildingId);
  }, [selectedSubBuildingId]);
*/
  const onSelectedSubbuildingChange = (e: any) => {
    setSelectedSubBuildingName(e.value);
    if (e.value === "전체동") {
      setSelectedSubBuildingId(0);
      props.setSelectedSubBuildingId(0);
    } else {
      const selectedSubId = subBuildingInfo.find(
        (item) => item.sub_building_name === e.value
      )?.id;
      setSelectedSubBuildingId(selectedSubId);
      props.setSelectedSubBuildingId(selectedSubId);
    }
  };

  return (
    <div>
      <div className="right-component">
        <DropDownList
          data={subBuildinglist}
          value={selectedSubBuildingName}
          onChange={onSelectedSubbuildingChange}
          style={{ height: "20px", width: "100px"}}
        />
      </div>
    </div>
  );
};

export default SubBuildingList;
