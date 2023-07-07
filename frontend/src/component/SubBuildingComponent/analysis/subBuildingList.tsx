import React, { useEffect, useState ,useRef} from "react";
import { DropDownList, ComboBox } from "@progress/kendo-react-dropdowns";
import axios from "axios";
import urlPrefix from "../../../resource/URL_prefix.json";
import { buildingInfo_interface } from "../../../interface/buildingInfo_interface";
import { subBuildingInfo_interface } from "../../../interface/subBuildingInfo_interface";

const SubBuildingList = (props: any) => {
  const [subBuildinglist, setSubBuildinglist] = useState<string[]>([]);
  const [subBuildingInfo, setSubBuildingInfo] = useState<
    subBuildingInfo_interface[]
  >([]);

  const [selectedSubBuildingName, setSelectedSubBuildingName] =
    useState<string>("전체동");
  const [selectedSubBuildingId, setSelectedSubBuildingId] = useState<number|undefined>(0);


  useEffect(() => {
    const fetchData = async () => {
      try {

        console.log( props.buildingInfo)
        const response = await axios.get(
          urlPrefix.IP_port + "/sub_building/" + props.buildingInfo.id
        );
        const data: subBuildingInfo_interface[] = JSON.parse(response.data); // assuming the API response contains an array of buildings

        let subBuildingNames: string[] = [];
        subBuildingNames.push("전체동");
        for (let i = 0; i < data.length; i++) {
          subBuildingNames.push(data[i].sub_building_name);
        }

        setSubBuildingInfo(data);
        setSubBuildinglist(subBuildingNames);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [props]);
  
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
      <div>
        <DropDownList
          data={subBuildinglist}
          value={selectedSubBuildingName}
          onChange={onSelectedSubbuildingChange}
          style={{width: "100%"}}
        />
      </div>
    </div>
  );
};

export default SubBuildingList;
