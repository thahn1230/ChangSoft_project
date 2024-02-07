import React, { useEffect, useState } from "react";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import {
  SubBuildingInfo,
  SubBuildingListInfo,
} from "interface/SubBuildingInterface";

import { getSubBuildingInfo } from "services/subbuilding/subbuildingService";

const SubBuildingList = (props: SubBuildingListInfo) => {
  const [subBuildinglist, setSubBuildinglist] = useState<string[]>([]);
  // const [subBuildingInfo, setSubBuildingInfo] = useState<SubBuildingInfo[]>([]);
  const [selectedSubBuildingName, setSelectedSubBuildingName] =
    useState<string>("전체동");

  useEffect(() => {
    console.log("subBuildinglist rendered");
  }, [subBuildinglist]);

  useEffect(() => {
    let prevSelectedSubBuilding = props.subBuildingInfo.find(
      (subBuilding: any) => subBuilding.id === props.selectedSubBuildingId
    );
    if (prevSelectedSubBuilding === undefined) {
      setSelectedSubBuildingName("전체동");
    } else {
      setSelectedSubBuildingName(prevSelectedSubBuilding.sub_building_name);
    }
  }, [props.selectedSubBuildingId]);

  useEffect(() => {
    if (props.buildingInfo?.id === undefined) return;
    getSubBuildingInfo(props.buildingInfo.id).then(
      (data: SubBuildingInfo[]) => {
        let subBuildingNames: string[] = [];
        subBuildingNames.push("전체동");
        for (let i = 0; i < data.length; i++) {
          subBuildingNames.push(data[i].sub_building_name);
        }

        setSubBuildinglist(subBuildingNames);
      }
    );
  }, [props.buildingInfo?.id]);

  const onSelectedSubbuildingChange = (e: any) => {
    if (e.value === "전체동") {
      props.setSelectedSubBuildingId(0);
    } else {
      const selectedSubId: number | undefined = props.subBuildingInfo.find(
        (item) => item.sub_building_name === e.value
      )?.id;
      if (selectedSubId) {
        props.setSelectedSubBuildingId(selectedSubId);
      }
    }
  };

  return (
    <div>
      <div>
        <DropDownList
          data={subBuildinglist}
          value={selectedSubBuildingName}
          onChange={onSelectedSubbuildingChange}
          style={{ width: "95%" }}
        />
      </div>
    </div>
  );
};

export default SubBuildingList;
