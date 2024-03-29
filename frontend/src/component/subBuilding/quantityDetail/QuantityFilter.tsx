import { useEffect, useState } from "react";
import {
  MultiSelectTree,
  MultiSelectTreeChangeEvent,
  getMultiSelectTreeValue,
} from "@progress/kendo-react-dropdowns";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { Button } from "@progress/kendo-react-buttons";
import {
  CompositeFilterDescriptor,
  filterBy,
} from "@progress/kendo-data-query";

import { BuildingInfo } from "interface/BuildingInterface";

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

interface QuantityFilterInfo {
  setGridData: React.Dispatch<React.SetStateAction<[]>>;
  buildingInfo: BuildingInfo | undefined;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const QuantityFilter = (props: QuantityFilterInfo) => {
  const [originalSubBuildingList, setOriginalSubBuildingList] = useState<
    SubBuildingI[]
  >([]);
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

  const [selectedType, setSelectedType] = useState("concrete");
  const [selectedTypeOnList, setSelectedTypeOnList] = useState("콘크리트");

  //const [isAnalyzable, setIsAnalyzable] = useState<boolean>(false);

  // 지금 buildinginfo를 가지고있으니까, buildingid가지고 그거의 subbuilding, floor, componenttype 처음에 다받아오기
  useEffect(() => {
    // setSubBuildingList
    // setFloorList
    // setComponentTypeList 다해야됨

    //3번 받아와야되나 아니면 3개 한번에?
    fetch(
      `${process.env.REACT_APP_API_URL}/sub_building/quantity_detail/get_quantity_list/${props.buildingInfo?.id}`,
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
          JSON.parse(rawData.subBuildingInfo).map((item: any) => ({
            subBuilding: item.sub_building_name,
            id: item.id,
            checked: false,
          }))
        );
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
        filterBy(
          filterBy(originalComponentTypeList, componentTypeFloorFilter),
          componentTypeSubBuildingFilter
        ).reduce((uniqueItems: any[], item: any) => {
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
      )
    );
  }, [componentTypeFloorFilter, componentTypeSubBuildingFilter]);

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
    });
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
    for (let item of selectedSubBuildingList) {
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
          return { ...item, checked: true };
        })
      );
    }
  };

  const onSelectedTypeChange = (e: any) => {
    setSelectedTypeOnList(e.value);
    switch (e.value) {
      case "콘크리트":
        setSelectedType("concrete");
        break;
      case "거푸집":
        setSelectedType("formwork");
        break;
      case "철근":
        setSelectedType("rebar");
        break;
    }
  };

  const getGridData = async () => {
    props.setIsLoading(true);
    let subBuildingInfo: SubBuildingI[] = [];
    let floorInfo: FloorI[] = [];
    let componentTypeInfo: ComponentTypeI[] = [];

    selectedSubBuildingList.map((item: SubBuildingI) => {
      originalSubBuildingList.map((originalItem: SubBuildingI) => {
        if (originalItem.subBuilding === item.subBuilding)
          subBuildingInfo.push(originalItem);
      });
    });
    const selectedSubBuildingIds = subBuildingInfo.map((item) => item.id);

    selectedFloorList.map((item: FloorI) => {
      originalFloorList.map((originalItem: FloorI) => {
        if (
          originalItem.floorName === item.floorName &&
          selectedSubBuildingIds.includes(originalItem.subBuildingId)
        )
          floorInfo.push(originalItem);
      });
    });
    const selectedFloorIds = floorInfo.map((item) => item.id);

    selectedComponentTypeList.map((item: ComponentTypeI) => {
      originalComponentTypeList.map((originalItem: ComponentTypeI) => {
        if (
          originalItem.componentType === item.componentType &&
          selectedSubBuildingIds.includes(originalItem.subBuildingId) &&
          selectedFloorIds.includes(originalItem.floorId)
        )
          componentTypeInfo.push(originalItem);
      });
    });

    const subBuildingInfo_noId = subBuildingInfo.map(
      ({ checked, ...rest }) => rest
    );
    const floorInfo_noId = floorInfo.map(({ checked, ...rest }) => rest);
    const componentTypeInfo_noId = componentTypeInfo.map(
      ({ id, checked, ...rest }) => rest
    );
    const info = {
      subBuildingList: subBuildingInfo_noId,
      floorList: floorInfo_noId,
      componentTypeList: componentTypeInfo_noId,
      type: selectedType,
      buildingId: props.buildingInfo?.id,
    };

    fetch(`${process.env.REACT_APP_API_URL}/sub_building/component_info`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ info }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((response) => {
        let data = JSON.parse(response).map(
          ({ id, building_id, component_id, sub_building_id, ...rest }: any) =>
            rest
        );

        switch (selectedType) {
          case "concrete":
            data = data.map(
              ({
                sub_building_name,
                object_id,
                component_type,
                section_name,
                construction_zone,
                summation_type,
                blinding,
                calculation_formula,
                material_name,
                coarse_aggregate,
                concrete_strength,
                slump,
                aggregate_strength_concrete_strength_slump,
                volume,
                floor_name,
              }: any) => ({
                층이름: floor_name,
                건물명: sub_building_name,
                객체ID: object_id,
                부재타입: component_type,
                단면이름: section_name,
                시공존: construction_zone,
                "합산 유형": summation_type,
                블라인딩: blinding,
                계산식: calculation_formula,
                재료명: material_name,
                "굵은 골재": coarse_aggregate,
                "콘크리트 강도": concrete_strength,
                슬럼프: slump,
                "골재-강도-슬럼프": aggregate_strength_concrete_strength_slump,
                체적: volume,
              })
            );

            break;
          case "formwork":
            data = data.map(
              ({
                sub_building_name,
                object_id,
                component_type,
                section_name,
                construction_zone,
                calculation_formula,
                formwork_position,
                formwork_type,
                area,
                floor_name,
              }: any) => ({
                층이름: floor_name,
                빌딩명: sub_building_name,
                객체ID: object_id,
                부재타입: component_type,
                단면이름: section_name,
                시공존: construction_zone,
                계산식: calculation_formula,
                형틀위치: formwork_position,
                형틀유형: formwork_type,
                면적: area,
              })
            );
            break;
          case "rebar":
            data = data.map(
              ({
                sub_building_name,
                object_id,
                component_type,
                section_name,
                construction_zone,
                component_id,
                calculation_formula,
                rebar_type,
                rebar_grade,
                rebar_diameter,
                rebar_shape_count,
                rebar_shape_length,
                rebar_unit_weight,
                rebar_count,
                rebar_weight,
                floor_name,
              }: any) => ({
                층이름: floor_name,
                구성: sub_building_name,
                건물명: object_id,
                부재타입: component_type,
                단면이름: section_name,
                층번호: construction_zone,
                시공존: component_id,
                계산식: calculation_formula,
                철근타입: rebar_type,
                철근강종: rebar_grade,
                철근직경: rebar_diameter,
                철근형상개수: rebar_shape_count,
                철근형상길이: rebar_shape_length,
                철근단위중량: rebar_unit_weight,
                개수: rebar_count,
                중량: rebar_weight,
              })
            );

            break;
        }
        props.setGridData(data);
        props.setIsLoading(false);
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <div className="filters-button-container">
    <label className="list-label">구분: </label>
        <DropDownList
        style={{ width: "13%" }}
        data={["콘크리트", "거푸집", "철근"]}
        value={selectedTypeOnList}
        onChange={onSelectedTypeChange}
      />

<label className="list-label">건물명: </label>
      <MultiSelectTree
        style={{ width: "20%"}}
        data={subBuildingList}
        value={selectedSubBuildingList}
        onChange={onNewSubBuildingSelection}
        textField="subBuilding"
        dataItemKey="id"
        checkField="checked"
        checkIndeterminateField={checkIndeterminateField}
        expandField={expandField}
      />

<label className="list-label">층: </label>
      <MultiSelectTree
        style={{ width: "24%" }}
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

<label className="list-label">부재: </label>
      <MultiSelectTree
        style={{ width: "15%"}}
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
          height: "3vh",
          margin:"1%"
        }}
      >
        Apply
      </Button>
    </div>
  );
};

export default QuantityFilter;
