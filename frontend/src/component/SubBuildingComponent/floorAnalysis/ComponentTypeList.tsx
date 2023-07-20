import React, { useEffect } from "react";
import {
  DropDownList,
  MultiSelect,
  MultiSelectChangeEvent,
  MultiSelectTree,
  MultiSelectTreeChangeEvent,
  MultiSelectTreeExpandEvent,
  getMultiSelectTreeValue,
} from "@progress/kendo-react-dropdowns";

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

interface ComponentTypeListProps extends React.HTMLProps<HTMLDivElement> {
  componentTypeList: { componentType: string; id: number; checked: boolean }[];
  selectedComponentType: {
    componentType: string;
    id: number;
    checked: boolean;
  }[];
  setComponentTypeList: React.Dispatch<
    React.SetStateAction<
      { componentType: string; id: number; checked: boolean }[]
    >
  >;
  setSelectedComponentType: React.Dispatch<
    React.SetStateAction<
      { componentType: string; id: number; checked: boolean }[]
    >
  >;
}

const ComponentTypeList = (props: ComponentTypeListProps) => {
  useEffect(() => {
    //set checkboxes
    const updatedComponentTypeList = props.componentTypeList.map((item) => {
      const matchingItem = props.selectedComponentType.find(
        (selectedItem) => selectedItem.id === item.id
      );

      if (matchingItem) {
        return { ...item, checked: true };
      } else return { ...item, checked: false };
    });

    if (
      props.componentTypeList.length ===
      props.selectedComponentType.length + 1
    ) {
      updatedComponentTypeList[0].checked =
        !updatedComponentTypeList[0].checked;
      props.setComponentTypeList(updatedComponentTypeList);
    } else {
      props.setComponentTypeList(updatedComponentTypeList);
    }
  }, [props.selectedComponentType]);

  const onNewSelectedComponentTypeSelection = (
    event: MultiSelectTreeChangeEvent
  ) => {
    if (event.items[0] === undefined) {
      props.setSelectedComponentType(
        getMultiSelectTreeValue(props.componentTypeList, {
          ...selectDropDownFields,
          ...event,
          value: props.componentTypeList,
        })
      );
    } else if (event.items[0].componentType === "All") {
      if (event.items[0].checked) {
        props.setSelectedComponentType([]);
      } else {
        props.setSelectedComponentType(
          getMultiSelectTreeValue(props.componentTypeList, {
            ...selectDropDownFields,
            ...event,
            value: props.componentTypeList,
          }).map((item) => ({ ...item, checked: true }))
        );
      }
    } else {
      props.setSelectedComponentType(
        getMultiSelectTreeValue(props.componentTypeList, {
          ...selectDropDownFields,
          ...event,
          value: props.selectedComponentType,
        }).map((item) => ({ ...item, checked: true }))
      );
    }
  };

  return (
    <div>
      <MultiSelectTree
        data={props.componentTypeList}
        value={props.selectedComponentType}
        onChange={onNewSelectedComponentTypeSelection}
        checkIndeterminateField={checkIndeterminateField}
        textField="componentType"
        checkField="checked"
        dataItemKey="id"
      />
    </div>
  );
};

export default ComponentTypeList;
