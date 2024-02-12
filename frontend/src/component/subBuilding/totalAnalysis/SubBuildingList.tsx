import React, { useEffect, useState } from "react";
import { DropDownList } from "@progress/kendo-react-dropdowns";

import { SubBuildingInfo } from "interface/SubBuildingInterface";
import { getSubBuildingInfo } from "services/subbuilding/subbuildingService";
import { useSubBuildingInfo } from "hooks/useSubBuildingInfo";

import "styles/SubBuildingList.scss";

const SubBuildingList = (props: any) => {
  const [selectedSubBuildingId, setSelectedSubBuildingId] =
    useSubBuildingInfo();
  const [subBuildinglist, setSubBuildinglist] = useState<string[]>([]);
  const [subBuildingInfo, setSubBuildingInfo] = useState<SubBuildingInfo[]>([]);
  const [selectedSubBuildingName, setSelectedSubBuildingName] =
    useState<string>("전체동");

  useEffect(() => {
    console.log(selectedSubBuildingId);
  }, []);

  useEffect(() => {
    let prevSelectedSubBuilding = props.subBuildingInfo.find(
      (subBuilding: any) => subBuilding.id === selectedSubBuildingId
    );
    if (prevSelectedSubBuilding === undefined) {
      setSelectedSubBuildingName("전체동");
    } else {
      setSelectedSubBuildingName(prevSelectedSubBuilding.sub_building_name);
    }

    getSubBuildingInfo(props.buildingInfo.id).then((data) => {
      let subBuildingNames: string[] = [];
      subBuildingNames.push("전체동");
      for (let i = 0; i < data.length; i++) {
        subBuildingNames.push(data[i].sub_building_name);
      }

      setSubBuildingInfo(data);
      setSubBuildinglist(subBuildingNames);
    });
  }, [props]);

  const onSelectedSubbuildingChange = (e: any) => {
    setSelectedSubBuildingName(e.value);
    if (e.value === "전체동") {
      setSelectedSubBuildingId(0);
    } else {
      const selectedSubId = subBuildingInfo.find(
        (item) => item.sub_building_name === e.value
      )?.id;
      if (selectedSubId === undefined) return;
      setSelectedSubBuildingId(selectedSubId);
    }
  };

  return (
    <div>
      <div>
        <DropDownList
          data={subBuildinglist}
          value={selectedSubBuildingName}
          onChange={onSelectedSubbuildingChange}
          style={{ width: "100%" }}
        />
      </div>
    </div>
  );
};

export default SubBuildingList;
