import react, { useEffect, useState } from "react";
import {
  DropDownList,
  DropDownListChangeEvent,
  MultiSelect,
  MultiSelectChangeEvent,
  MultiSelectTree,
  MultiSelectTreeChangeEvent,
  MultiSelectTreeExpandEvent,
  getMultiSelectTreeValue,
} from "@progress/kendo-react-dropdowns";
import { Button } from "@progress/kendo-react-buttons";
import { subBuildingInfo_interface } from "../../../interface/subBuildingInfo_interface";
import urlPrefix from "../../../resource/URL_prefix.json";
import { itemIndexStartsWith } from "@progress/kendo-react-dropdowns/dist/npm/common/utils";
import SingleColTable from "./SingleColTable"

interface idNameI {
    id: number;
    name: string;
  }

  //buildinginfo랑 setgriddata를 props로
const QuantityFilter = (props:any)=>{
    const [subBuildingIdName, setSubBuildingIdName] = useState<idNameI[]>();
  const [subBuildingNameList, setSubBuildingNameList] = useState<string[]>();
  const [selectedSubBuildingName, setSelectedSubBuildingName] =
    useState<string>();
  const [selectedSubBuildingId, setSelectedSubBuildingId] = useState<number>();

  const [floorIdName, setFloorIdName] = useState<idNameI[]>();
  const [floorNameList, setFloorNameList] = useState<string[]>();
  const [selectedFloorName, setSelectedFloorName] = useState<string>();
  const [selectedFloorId, setSelectedFloorId] = useState<number>();

  const [componentTypeList, setComponentTypeList] = useState<string[]>();
  const [selectedComponentType, setSelectedComponentType] = useState<string>();

  useEffect(() => {
    fetch(urlPrefix.IP_port + "/sub_building/" + props.buildingInfo.id, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((rawData) => {
        const data: subBuildingInfo_interface[] = JSON.parse(rawData);
        setSubBuildingIdName(
          data.map((item) => ({ id: item.id, name: item.sub_building_name }))
        );
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  //선택된 id도 같이 변경
  useEffect(() => {
    const newSelectedSubBuildingId = subBuildingIdName?.find(
      (item) => item.name === selectedSubBuildingName
    );
    if (newSelectedSubBuildingId === undefined) return;
    setSelectedSubBuildingId(newSelectedSubBuildingId.id);
  }, [selectedSubBuildingName]);
  useEffect(() => {
    const newFloorIdName = floorIdName?.find(
      (item) => item.name === selectedFloorName
    );
    if (newFloorIdName === undefined) return;
    setSelectedFloorId(newFloorIdName.id);
  }, [selectedFloorName]);

  useEffect(() => {}, [selectedComponentType]);

  //해당하는 다음 list fetch
  useEffect(() => {
    fetch(
      urlPrefix.IP_port +
        "/sub_building/quantity_detail/get_floor_list/" +
        selectedSubBuildingId,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((rawData) => {
        const data = JSON.parse(rawData);
        setFloorIdName(
          data.map((item: any) => ({
            id: Number.parseInt(item.floor_id),
            name: item.floor_name,
          }))
        );
      })
      .catch((error) => console.error("Error:", error));
  }, [selectedSubBuildingId]);
  useEffect(() => {
    fetch(
      //url바꿔야됨
      urlPrefix.IP_port +
        "/sub_building/quantuty_detail/get_component_type_list/" +
        selectedSubBuildingId +
        "/" +
        selectedFloorId,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((rawData) => {
        //data로 뭐들어오는지 보고 string[]으로 형변환해야됨
        const data = JSON.parse(rawData);
        setComponentTypeList(data.map((item: any) => item.component_type));
      })
      .catch((error) => console.error("Error:", error));
  }, [selectedFloorId]);

  useEffect(() => {
    const newSubBuildingNameList = subBuildingIdName?.map((item) => item.name);
    setSubBuildingNameList(newSubBuildingNameList);
  }, [subBuildingIdName]);
  useEffect(() => {
    const newFloorNameList = floorIdName?.map((item) => item.name);
    setFloorNameList(newFloorNameList);
  }, [floorIdName]);

  const onSelectedSubBuildingChange = (e: DropDownListChangeEvent) => {
    setSelectedSubBuildingName(e.value);
  };
  const onSelectedFloorNameChange = (e: DropDownListChangeEvent) => {
    setSelectedFloorName(e.value);
  };
  const onSelectedComponentTypeChange = (e: DropDownListChangeEvent) => {
    setSelectedComponentType(e.value);
  };

  const getGrid = () => {
    const url = new URL(
        `${urlPrefix.IP_port}/sub_building/quantity_detail/show_table/${selectedSubBuildingId}/${selectedFloorId}/${selectedComponentType}`
      );
    fetch(
        url,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((rawData) => {
          const data = JSON.parse(rawData);
          props.setGridData(data)
        })
        .catch((error) => console.error("Error:", error));
  };


  return( <div className="filters-button-container">
  <div className="first-line-container">
    <DropDownList
      data={subBuildingNameList}
      value={selectedSubBuildingName}
      onChange={onSelectedSubBuildingChange}
      disabled={false}
      style={{ width: "59%", margin: "1%" }}
    />
    <DropDownList
      data={floorNameList}
      value={selectedFloorName}
      onChange={onSelectedFloorNameChange}
      disabled={false}
      style={{ width: "59%", margin: "1%" }}
    />
    <DropDownList
      data={componentTypeList}
      value={selectedComponentType}
      onChange={onSelectedComponentTypeChange}
      disabled={false}
      style={{ width: "59%", margin: "1%" }}
    />
    <Button
      onClick={getGrid}
      // disabled={selectedComponentType===""}
      style={{
        backgroundColor: "rgb(25, 101, 203)",
        color: "white",
        width: "5vw",
        height: "4vh",
      }}
    >
      Let's go!!
    </Button>
  </div>
</div>)
}

export default QuantityFilter;