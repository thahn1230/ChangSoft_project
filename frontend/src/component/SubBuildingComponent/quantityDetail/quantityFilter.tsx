import react, { useEffect, useState } from "react";
import {
  MultiSelectTree,
  MultiSelectTreeChangeEvent,
  getMultiSelectTreeValue,
} from "@progress/kendo-react-dropdowns";
import { Button } from "@progress/kendo-react-buttons";
import { subBuildingInfo_interface } from "../../../interface/subBuildingInfo_interface";
import urlPrefix from "../../../resource/URL_prefix.json";
import {
  CompositeFilterDescriptor,
  filterBy,
  FilterDescriptor,
} from "@progress/kendo-data-query";
import SingleColTable from "./SingleColTable";
import { dropDownListArrowBtnAriaLabel } from "@progress/kendo-react-dropdowns/dist/npm/messages";

const dataItemKey = "id";
const checkField = "checkField";
const checkIndeterminateField = "checkIndeterminateField";
const expandField = "expanded";
const subItemsField = "items";

const selectDropDownFields = {
  dataItemKey,
  checkField,
  checkIndeterminateField,
  expandField,
  subItemsField,
};

interface idNameI {
  id: number;
  name: string;
}
interface ConcreteDataI {
  id: number;
  object_id: number;
  floor_id: number;
  sub_building_id: number;
  component_type: string;
  section_name: string;
  construction_zone: string;
  category: string;
  component_id: number;
  summation_type: string;
  blinding: string;
  calculation_formula: string;
  material_name: string;
  coarse_aggregate: string;
  concrete_strength: string;
  slump: string;
  aggregate_strength_concrete_strength_slump: string;
  volume: number;
}
interface FormworkDataI {
  id: number;
  object_id: number;
  floor_id: number;
  sub_building_id: number;
  component_type: string;
  section_name: string;
  construction_zone: string;
  category: string;
  component_id: number;
  calculation_formula: string;
  formwork_position: string;
  formwork_type: string;
  area: number;
}
interface RebarDataI {
  id: number;
  object_id: number;
  floor_id: number;
  sub_building_id: number;
  component_type: string;
  section_name: string;
  construction_zone: string;
  category: string;
  component_id: number;
  calculation_formula: string;
  rebar_type: string;
  rebar_grade: string;
  rebar_diameter: number;
  rebar_shape_count: number;
  rebar_shape_length: number;
  rebar_unit_weight: number;
  rebar_id: number;
  rebar_count: number;
  rebar_weight: number;
}

interface SubBuildingI {
  subBuilding: string;
  id: number;
  checked: boolean;
}
interface FloorI {
  id: number;
  floorName: string;
  subBuildingId: number;
  checked: boolean;
}
interface ComponentTypeI {
  id: number;
  floorId: number;
  subBuildingId: number;
  componentType: string;
  checked: boolean;
}
//buildinginfo랑 setgriddata를 props로
const QuantityFilter = (props: any) => {
  const [originalSubBuildingList, setOriginalSubBuildingList]= useState<SubBuildingI[]>([]);
  const [subBuildingList, setSubBuildingList] = useState<SubBuildingI[]>([]);
  const [selectedSubBuildingList, setSelectedSubBuildingList] = useState<
    SubBuildingI[]
  >([]);

  const [originalFloorList, setOriginalFloorList] = useState<FloorI[]>([]);
  const [floorList, setFloorList] = useState<FloorI[]>([]);
  const [filteredFloorList, setFilteredFloorList] = useState<FloorI[]>([]);
  const [selectedFloorList, setSelectedFloorList] = useState<FloorI[]>([]);
  const [floorFilter, setFloorFilter] = useState<CompositeFilterDescriptor>({
    logic: "or",
    filters: [],
  });

  const [originalComponentTypeList, setOriginalComponentTypeList] = useState<
    ComponentTypeI[]
  >([]);
  const [componentTypeList, setComponentTypeList] = useState<ComponentTypeI[]>(
    []
  );
  const [filteredComponentTypeList, setFilteredComponentTypeList] = useState<
    ComponentTypeI[]
  >([]);
  const [selectedComponentTypeList, setSelectedComponentTypeList] = useState<
    ComponentTypeI[]
  >([]);
  const [componentTypeFloorFilter, setComponentTypeFloorFilter] =
    useState<CompositeFilterDescriptor>({
      logic: "or",
      filters: [],
    });
    const [componentTypeSubBuildingFilter, setComponentTypeSubBuildingFilter] =
      useState<CompositeFilterDescriptor>({
        logic: "or",
        filters: [],
      });

  //const [isAnalyzable, setIsAnalyzable] = useState<boolean>(false);

  // 지금 buildinginfo를 가지고있으니까, buildingid가지고 그거의 subbuilding, floor, componenttype 처음에 다받아오기
  useEffect(() => {
    // setSubBuildingList
    // setFloorList
    // setComponentTypeList 다해야됨

    //3번 받아와야되나 아니면 3개 한번에?
    fetch(
      urlPrefix.IP_port +
        "/sub_building/quantity_detail/get_quantity_list/" +
        props.buildingInfo.id,
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
        //{ subBuilding: string; id: number; checked: boolean }
        const uniqueSubBuildingList: SubBuildingI[] = [
          {
            subBuilding: "All",
            id: 0,
            checked: false,
          },
        ].concat(
          JSON.parse(rawData.subBuildingInfo)
            .map((item: any) => ({
              subBuilding: item.sub_building_name,
              id: item.id,
              checked: false,
            }))
            .reduce((uniqueItems: any[], item: any) => {
              const existingItem = uniqueItems.find(
                (uniqueItem) => uniqueItem.subBuilding === item.subBuilding
              );

              if (!existingItem) {
                uniqueItems.push({
                  subBuilding: item.subBuilding,
                  id: item.id,
                  checked: false,
                });
              }

              return uniqueItems;
            }, [])
        );

        const uniqueFloorList: FloorI[] = [
          {
            floorName: "All",
            subBuildingId: 0,
            id: 0,
            checked: false,
          },
        ].concat(
          JSON.parse(rawData.floorInfo)
            .map((item: any) => ({
              floorName: item.floor_name,
              subBuildingId: item.sub_building_id,
              id: item.id,
              checked: false,
            }))
            .reduce((uniqueItems: any[], item: any) => {
              const existingItem = uniqueItems.find(
                (uniqueItem) => uniqueItem.floorName === item.floorName
              );

              if (!existingItem) {
                uniqueItems.push({
                  floorName: item.floorName,
                  subBuildingId: item.subBuildingId,
                  id: item.id,
                  checked: false,
                });
              }

              return uniqueItems;
            }, [])
        );

        const uniqueComponentTypeList: ComponentTypeI[] = [
          {
            id: 0,
            floorId: 0,
            subBuildingId: 0,
            componentType: "All",
            checked: false,
          },
        ].concat(
          JSON.parse(rawData.componentInfo)
            .map((item: any) => ({
              componentType: item.component_type,
              floorId: item.floor_id,
              subBuildingId: item.sub_building_id,
              id: item.id,
              checked: false,
            }))
            .reduce((uniqueItems: any[], item: any) => {
              const existingItem = uniqueItems.find(
                (uniqueItem) => uniqueItem.componentType === item.componentType
              );

              if (!existingItem) {
                uniqueItems.push({
                  id: item.id,
                  floorId: item.floorId,
                  subBuildingId: item.subBuildingId,
                  componentType: item.componentType,
                  checked: false,
                });
              }

              return uniqueItems;
            }, [])
        );

        setOriginalSubBuildingList(
          JSON.parse(rawData.subBuildingInfo)
            .map((item: any) => ({
              subBuilding: item.sub_building_name,
              id: item.id,
              checked: false,
            }))
        )
        setOriginalFloorList(
          JSON.parse(rawData.floorInfo).map((item: any) => ({
            floorName: item.floor_name,
            subBuildingId: item.sub_building_id,
            id: item.id,
            checked: false,
          }))
        );
        setOriginalComponentTypeList(
          JSON.parse(rawData.componentInfo).map((item: any) => ({
            componentType: item.component_type,
            floorId: item.floor_id,
            subBuildingId: item.sub_building_id,
            id: item.id,
            checked: false,
          }))
        );

        setSubBuildingList(uniqueSubBuildingList);
        setFloorList(uniqueFloorList);
        setComponentTypeList(uniqueComponentTypeList);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  useEffect(() => {
    // setFilteredFloorList(floorList);
  }, [floorList]);
  useEffect(() => {
    // setFilteredComponentTypeList(componentTypeList);
  }, [componentTypeList]);

  useEffect(() => {
    setFilteredFloorList(
      [
        {
          floorName: "All",
          subBuildingId: 0,
          id: 0,
          checked: false,
        },
      ].concat(
        filterBy(originalFloorList, floorFilter).reduce(
          (uniqueItems: any[], item: any) => {
            const existingItem = uniqueItems.find(
              (uniqueItem) => uniqueItem.floorName === item.floorName
            );

            if (!existingItem) {
              uniqueItems.push({
                floorName: item.floorName,
                subBuildingId: item.subBuildingId,
                id: item.id,
                checked: false,
              });
            }

            return uniqueItems;
          },
          []
        )
      )
    );
  }, [floorFilter]);
  useEffect(() => {
    setFilteredComponentTypeList(
      [
        {
          componentType: "All",
          subBuildingId: 0,
          floorId: 0,
          id: 0,
          checked: false,
        },
      ].concat(
        filterBy(filterBy(originalComponentTypeList, componentTypeFloorFilter) ,componentTypeSubBuildingFilter).reduce(
          (uniqueItems: any[], item: any) => {
            const existingItem = uniqueItems.find(
              (uniqueItem) => uniqueItem.componentType === item.componentType
            );

            if (!existingItem) {
              uniqueItems.push({
                id: item.id,
                floorId: item.floorId,
                subBuildingId: item.subBuildingId,
                componentType: item.componentType,
                checked: false,
              });
            }

            return uniqueItems;
          },
          []
        )
      )
    );
  }, [componentTypeFloorFilter,componentTypeSubBuildingFilter]);

  //useEffect(()=>{console.log(filteredFloorList)},[filteredFloorList])

  useEffect(() => {
    //subbuilding이 선택되면 그에맞게 floor를 설정해주고
    setFloorFilter({
      logic: "or",
      filters: [],
    });

    let newFloorFilter: CompositeFilterDescriptor = {
      logic: "or",
      filters: [{ field: "subBuildingId", operator: "eq", value: "All" }],
    };
    for (let item of selectedSubBuildingList) {
      newFloorFilter.filters.push({
        field: "subBuildingId",
        operator: "eq",
        value: item.id,
      });
    }
    setFloorFilter(newFloorFilter);

    //set checkboxes of subbuilding list
    const updatedSubBuildingList = subBuildingList.map((item) => {
      const matchingItem = selectedSubBuildingList.find(
        (selectedItem) => selectedItem.id === item.id
      );

      if (matchingItem) {
        return { ...item, checked: true };
      } else return { ...item, checked: false };
    });

    if (subBuildingList.length === selectedSubBuildingList.length + 1) {
      updatedSubBuildingList[0].checked = !updatedSubBuildingList[0].checked;
      setSubBuildingList(updatedSubBuildingList);
    } else setSubBuildingList(updatedSubBuildingList);
  }, [selectedSubBuildingList]);
  useEffect(() => {
    //subbuilding이 선택되면 그에맞게 floor를 설정해주고
    setComponentTypeFloorFilter({
      logic: "or",
      filters: [],
    });
    setComponentTypeSubBuildingFilter({
      logic: "or",
      filters: [],
    })
    //all없어도되는거아닌가
    let newComponentTypeFloorFilter: CompositeFilterDescriptor = {
      logic: "or",
      filters: [{ field: "floorId", operator: "eq", value: 0 }],
    };
    let newComponentTypeSubBuildingFilter: CompositeFilterDescriptor = {
      logic: "or",
      filters: [{ field: "floorId", operator: "eq", value: 0 }],
    };

    for (let item of selectedFloorList) {
      newComponentTypeFloorFilter.filters.push({
        field: "floorId",
        operator: "eq",
        value: item.id,
      });
    }
    for(let item of selectedSubBuildingList){
      newComponentTypeSubBuildingFilter.filters.push({
        field: "subBuildingId",
        operator: "eq",
        value: item.id,
      });
    }
    setComponentTypeFloorFilter(newComponentTypeFloorFilter);
    setComponentTypeSubBuildingFilter(newComponentTypeSubBuildingFilter);


    // console.log("filteredFloorList")
    // console.log(filteredFloorList)
    //set checkboxes of floor list
    const updatedFloorList = filteredFloorList.map((item) => {
      const matchingItem = selectedFloorList.find(
        (selectedItem) => selectedItem.id === item.id
      );

      if (matchingItem) {
        return { ...item, checked: true };
      } else return { ...item, checked: false };
    });

    if (filteredFloorList.length === selectedFloorList.length + 1) {
      updatedFloorList[0].checked = !updatedFloorList[0].checked;

      setFilteredFloorList(updatedFloorList);
    } else setFilteredFloorList(updatedFloorList);
  }, [selectedFloorList]);
  useEffect(() => {
    //따로 필터설정할건없고, check만 잘 처리해주면 됨
    // console.log("filteredComponentTypeList")
    // console.log(filteredComponentTypeList)
    const updatedComponentTypeList = filteredComponentTypeList.map((item) => {
      const matchingItem = selectedComponentTypeList.find(
        (selectedItem) => selectedItem.id === item.id
      );

      if (matchingItem) {
        return { ...item, checked: true };
      } else return { ...item, checked: false };
    });

    if (
      filteredComponentTypeList.length ===
      selectedComponentTypeList.length + 1
    ) {
      updatedComponentTypeList[0].checked =
        !updatedComponentTypeList[0].checked;
      setFilteredComponentTypeList(updatedComponentTypeList);
    } else setFilteredComponentTypeList(updatedComponentTypeList);
  }, [selectedComponentTypeList]);

  const onNewSubBuildingSelection = (event: MultiSelectTreeChangeEvent) => {
    if (event.items[0] === undefined) {
      setSelectedSubBuildingList(
        getMultiSelectTreeValue(subBuildingList, {
          ...selectDropDownFields,
          ...event,
          value: [],
        })
      );
    } else if (event.items[0].subBuilding === "All") {
      if (event.items[0].checked) {
        setSelectedSubBuildingList([]);
      } else {
        setSelectedSubBuildingList(
          getMultiSelectTreeValue(subBuildingList, {
            ...selectDropDownFields,
            ...event,
            value: subBuildingList,
          }).map((item) => ({ ...item, checked: true }))
        );
      }
    } else {
      setSelectedSubBuildingList(
        getMultiSelectTreeValue(subBuildingList, {
          ...selectDropDownFields,
          ...event,
          value: selectedSubBuildingList,
        }).map((item) => ({ ...item, checked: true }))
      );
    }
  };
  const onNewFloorSelection = (event: MultiSelectTreeChangeEvent) => {
    if (event.items[0] === undefined) {
      setSelectedFloorList(
        getMultiSelectTreeValue(floorList, {
          ...selectDropDownFields,
          ...event,
          value: [],
        })
      );
    } else if (event.items[0].floorName === "All") {
      if (event.items[0].checked) {
        setSelectedFloorList([]);
      } else {
        setSelectedFloorList(
          getMultiSelectTreeValue(floorList, {
            ...selectDropDownFields,
            ...event,
            value: filteredFloorList,
          }).map((item) => ({ ...item, checked: true }))
        );
      }
    } else {
      setSelectedFloorList(
        getMultiSelectTreeValue(filteredFloorList, {
          ...selectDropDownFields,
          ...event,
          value: selectedFloorList,
        }).map((item) => ({ ...item, checked: true }))
      );
    }
  };
  const onNewComponentTypeSelection = (event: MultiSelectTreeChangeEvent) => {
    
    if (event.items[0] === undefined) {
      setSelectedComponentTypeList(
        getMultiSelectTreeValue(componentTypeList, {
          ...selectDropDownFields,
          ...event,
          value: [],
        })
      );
    } else if (event.items[0].componentType === "All") {
      if (event.items[0].checked) {
        setSelectedComponentTypeList([]);
      } else {
        setSelectedComponentTypeList(
          getMultiSelectTreeValue(componentTypeList, {
            ...selectDropDownFields,
            ...event,
            value: filteredComponentTypeList,
          }).map((item) => ({ ...item, checked: true }))
        );
      }
    } else {
      setSelectedComponentTypeList(
        getMultiSelectTreeValue(filteredComponentTypeList, {
          ...selectDropDownFields,
          ...event,
          value: selectedComponentTypeList,
        }).map((item) => {
          return ({ ...item, checked: true })})
      );
    }
  };

  const getGridData = async () => {
    let subBuildingInfo:SubBuildingI[] =[];
    let floorInfo:FloorI[]= [];
    let componentTypeInfo : ComponentTypeI[] = [];

    selectedSubBuildingList.map((item:SubBuildingI)=>{
      originalSubBuildingList.map((originalItem:SubBuildingI)=>{ if(originalItem.subBuilding === item.subBuilding)
        subBuildingInfo.push(originalItem)})
    })
    const selectedSubBuildingIds = subBuildingInfo.map((item)=>item.id)

    selectedFloorList.map((item:FloorI)=>{
      originalFloorList.map((originalItem:FloorI)=>{ if(originalItem.floorName === item.floorName && selectedSubBuildingIds.includes(originalItem.subBuildingId ))
        floorInfo.push(originalItem)})
    })
    const selectedFloorIds = floorInfo.map((item)=>item.id)

    selectedComponentTypeList.map((item:ComponentTypeI)=>{
      originalComponentTypeList.map((originalItem:ComponentTypeI)=>{ 
        if(originalItem.componentType === item.componentType
          && selectedSubBuildingIds.includes(originalItem.subBuildingId)
          && selectedFloorIds.includes(originalItem.floorId))
        componentTypeInfo.push(originalItem)})
    })

    const subBuildingInfo_noId = subBuildingInfo.map(({checked, ...rest})=>rest)
    const floorInfo_noId = floorInfo.map(({checked, ...rest})=>rest)
    const componentTypeInfo_noId = componentTypeInfo.map(({id, checked, ...rest})=>rest)
    const info = {
      subBuildingList: subBuildingInfo_noId,
      floorList: floorInfo_noId,
      componentTypeList: componentTypeInfo_noId,
      type: props.selectedType,
      buildingId: props.buildingInfo.id
    }

    console.log(info)
    const response = await fetch(urlPrefix.IP_port + "/sub_building/component_info", {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({info }),
    });

    console.log(response)
  };

  return (
    <div className="filters-button-container">
      <MultiSelectTree
        style={{ width: "24%", margin: "1%" }}
        data={subBuildingList}
        value={selectedSubBuildingList}
        onChange={onNewSubBuildingSelection}
        textField="subBuilding"
        dataItemKey="id"
        checkField="checked"
        checkIndeterminateField={checkIndeterminateField}
        expandField={expandField}
      />

      <MultiSelectTree
        style={{ width: "29%", margin: "1%" }}
        data={filteredFloorList}
        value={selectedFloorList}
        onChange={onNewFloorSelection}
        textField="floorName"
        dataItemKey="id"
        checkField="checked"
        checkIndeterminateField={checkIndeterminateField}
        expandField={expandField}
        disabled={selectedSubBuildingList.length === 0}
        // tags={
        //   selectedProjectList.length > 0
        //     ? [
        //         {
        //           text: `${selectedProjectList.length} projects selected`,
        //           data: [...selectedProjectList],
        //         },
        //       ]
        //     : []
        // }
      />

      <MultiSelectTree
        style={{ width: "19%", margin: "1%" }}
        data={filteredComponentTypeList}
        value={selectedComponentTypeList}
        onChange={onNewComponentTypeSelection}
        textField="componentType"
        dataItemKey="id"
        checkField="checked"
        checkIndeterminateField={checkIndeterminateField}
        expandField={expandField}
        disabled={selectedFloorList.length === 0}
        // tags={
        //   selectedBuildingList.length > 0
        //     ? [
        //         {
        //           text: `${selectedBuildingList.length} buildings selected`,
        //           data: [...selectedBuildingList],
        //         },
        //       ]
        //     : []
        // }
      />
      <Button
        onClick={getGridData}
        style={{
          backgroundColor: "rgb(25, 101, 203)",
          color: "white",
          width: "5vw",
          height: "4vh",
        }}
      >
        Apply
      </Button>
    </div>
  );
};

export default QuantityFilter;
