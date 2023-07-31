import react, { useEffect, useState,useCallback } from "react";
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
import urlPrefix from "./../../../resource/URL_prefix.json";
import { itemIndexStartsWith } from "@progress/kendo-react-dropdowns/dist/npm/common/utils";
import {
  RadioButton,
  RadioButtonChangeEvent,
} from "@progress/kendo-react-inputs";
import SingleColTable from "./SingleColTable";
import QuantityFilter from "./quantityFilter";

const QuantityDetailTab = (props: any) => {
  const [gridData, setGridData] = useState<[]>([]);
  const [selectedType, setSelectedType] = useState("Concrete");

  const onTypeChange = useCallback(
    (e: RadioButtonChangeEvent) => {
      setSelectedType(e.value);
    },
    [setSelectedType]
  );

  return (
    <div>
      <QuantityFilter
        setGridData={setGridData}
        buildingInfo={props.buildingInfo}
      ></QuantityFilter>

      <div className="radio-button-container">
        <RadioButton
          value="Concrete"
          checked={selectedType === "Concrete"}
          label="콘크리트"
          onChange={onTypeChange}
          style={{ marginLeft: "10px" }}
          className="k-radio-button"
        />
        <RadioButton
          value="Formwork"
          checked={selectedType === "Formwork"}
          label="거푸집"
          onChange={onTypeChange}
          style={{ marginLeft: "10px" }}
          className="k-radio-button"
        />
        <RadioButton
          value="Rebar"
          checked={selectedType === "Rebar"}
          label="철근"
          onChange={onTypeChange}
          style={{ marginLeft: "10px" }}
          className="k-radio-button"
        />
      </div>

      
      <SingleColTable data={gridData}></SingleColTable>
    </div>
  );
};

export default QuantityDetailTab;
