import {  useState } from "react";
import SingleColTable from "component/subBuilding/quantityDetail/SingleColTable";
import QuantityFilter from "component/subBuilding/quantityDetail/QuantityFilter";
import PivotTableChart from "component/subBuilding/quantityDetail/PivotTableChart";
import { Button } from "@progress/kendo-react-buttons";

import { useBuildingInfo } from "hooks/useBuildingInfo";

import "styles/analysisTab.scss";

const QuantityDetailTab = () => {
  const [buildingInfo, setBuildingInfo] = useBuildingInfo();

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
            buildingInfo={buildingInfo}
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
