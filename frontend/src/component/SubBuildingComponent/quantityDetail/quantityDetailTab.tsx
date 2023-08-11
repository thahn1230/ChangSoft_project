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
  const [isLoading, setIsLoading]=  useState<boolean>(false);

  return (
    <div>
      <div className="filter-container">
        <div>
          <QuantityFilter
            setGridData={setGridData}
            buildingInfo={props.buildingInfo}
            // isLoading={isLoading}
            setIsLoading={setIsLoading}
            // selectedType={selectedType}
          ></QuantityFilter>
        </div>

      </div>

      <div className="info-table-container" style={{ maxWidth: "90vw" }}>
        <SingleColTable data={gridData} isLoading={isLoading}></SingleColTable>
      </div>
      {/* <PivotTable data={gridData}></PivotTable> */}
    </div>
  );
};

export default QuantityDetailTab;
