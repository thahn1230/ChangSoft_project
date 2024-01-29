import React, { useEffect, useState } from "react";
import { DropDownList } from "@progress/kendo-react-dropdowns";

import { BuildingInfo } from "interface/BuildingInterface";
import {
  SubBuildingInfo,
  SubBuildingListInfo,
} from "interface/SubBuildingInterface";

import { getSubBuildingInfo } from "services/subbuilding/subbuildingService";

const SubBuildingList = (props: SubBuildingListInfo) => {
  const [subBuildinglist, setSubBuildinglist] = useState<string[]>([]);
  const [subBuildingInfo, setSubBuildingInfo] = useState<SubBuildingInfo[]>([]);

  const [selectedSubBuildingName, setSelectedSubBuildingName] =
    useState<string>("전체동");
  const [selectedSubBuildingId, setSelectedSubBuildingId] = useState<
    number | undefined
  >(0);

  const [selectedBuilding, setSelectedBuilding] = useState<BuildingInfo>();

  useEffect(() => {
    if (props.buildingInfo?.id === undefined) return;
    let prevSelectedSubBuilding = props.subBuildingInfo.find(
      (subBuilding: any) => subBuilding.id === props.selectedSubBuildingId
    );
    if (prevSelectedSubBuilding === undefined) {
      setSelectedSubBuildingName("전체동");
    } else {
      setSelectedSubBuildingName(prevSelectedSubBuilding.sub_building_name);
    }

    setSelectedBuilding(props.buildingInfo);

    getSubBuildingInfo(props.buildingInfo.id).then(
      (data: SubBuildingInfo[]) => {
        let subBuildingNames: string[] = [];
        subBuildingNames.push("전체동");
        for (let i = 0; i < data.length; i++) {
          subBuildingNames.push(data[i].sub_building_name);
        }

        setSubBuildingInfo(data);
        setSubBuildinglist(subBuildingNames);
      }
    );
  }, [props]);

  const onSelectedSubbuildingChange = (e: any) => {
    setSelectedSubBuildingName(e.value);
    if (e.value === "전체동") {
      setSelectedSubBuildingId(0);
      props.setSelectedSubBuildingId(0);
    } else {
      const selectedSubId: number | undefined = subBuildingInfo.find(
        (item) => item.sub_building_name === e.value
      )?.id;
      setSelectedSubBuildingId(selectedSubId);
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