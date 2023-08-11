import react, { useEffect, useState, useCallback } from "react";
import {
  RadioButton,
  RadioButtonChangeEvent,
} from "@progress/kendo-react-inputs";
import SingleColTable from "./SingleColTable";
import QuantityFilter from "./quantityFilter";
import PivotTable from "./PivotTable";
import PivotTableChart from "./PivotTableChart";
import "./../../../styles/analysisTab.scss";
import { Button } from "@progress/kendo-react-buttons";

const QuantityDetailTab = (props: any) => {
  const [gridData, setGridData] = useState<[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showTable, setShowTable] = useState(true);
  const [showPivot, setShowPivot] = useState(false);

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

      <div>
        <div style={{ textAlign: "left" }}>
          <Button
            onClick={() => setShowTable(!showTable)}
            style={{
              backgroundColor: "rgb(75, 151, 203)",
              color: "white",
              width: "5vw",
              height: "3vh",
              margin: "1%",
            }}
          >
            {showTable ? "Hide Table" : "Show Table"}
          </Button>
        </div>
        {showTable && (
          <div className="info-table-container" style={{ maxWidth: "90vw" }}>
            <SingleColTable
              data={gridData}
              isLoading={isLoading}
            ></SingleColTable>
          </div>
        )}

        <div style={{ textAlign: "left" }}>
          <Button
            onClick={() => setShowPivot(!showPivot)}
            style={{
              backgroundColor: "rgb(75, 151, 203)",
              color: "white",
              width: "5vw",
              height: "3vh",
              margin: "1%",
            }}
          >
            {showPivot ? "Hide Pivot" : "Show Pivot"}
          </Button>
        </div>
        {showPivot && (
          <div style={{ clear: "both", maxWidth: "90vw" }}>
            <br />
            <PivotTableChart data={gridData} isLoading={isLoading}></PivotTableChart>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuantityDetailTab;
