import react, { useEffect, useState, useCallback } from "react";
import {
  RadioButton,
  RadioButtonChangeEvent,
} from "@progress/kendo-react-inputs";
import SingleColTable from "./SingleColTable";
import QuantityFilter from "./quantityFilter";
import PivotTable from "./pivotTable";
import "./../../../styles/analysisTab.scss";

const QuantityDetailTab = (props: any) => {
  const [gridData, setGridData] = useState<[]>([]);
  const [selectedType, setSelectedType] = useState("concrete");

  const onTypeChange = useCallback(
    (e: RadioButtonChangeEvent) => {
      setSelectedType(e.value);
    },
    [setSelectedType]
  );

  return (
    <div>
      <div className="filter-container">
        <div>
          <QuantityFilter
            setGridData={setGridData}
            buildingInfo={props.buildingInfo}
            selectedType={selectedType}
          ></QuantityFilter>
        </div>

        <div className="radio-button-container">
          <RadioButton
            value="concrete"
            checked={selectedType === "concrete"}
            label="콘크리트"
            onChange={onTypeChange}
            style={{ marginLeft: "10px" }}
            className="k-radio-button"
          />
          <RadioButton
            value="formwork"
            checked={selectedType === "formwork"}
            label="거푸집"
            onChange={onTypeChange}
            style={{ marginLeft: "10px" }}
            className="k-radio-button"
          />
          <RadioButton
            value="rebar"
            checked={selectedType === "rebar"}
            label="철근"
            onChange={onTypeChange}
            style={{ marginLeft: "10px" }}
            className="k-radio-button"
          />
        </div>
      </div>

      <div className="info-table-container" style={{ maxWidth: "90vw" }}>
        <SingleColTable data={gridData}></SingleColTable>
      </div>
      {/* <PivotTable data={gridData}></PivotTable> */}
    </div>
  );
};

export default QuantityDetailTab;
