import React from "react";
import { Grid, GridColumn, GridEvent } from "@progress/kendo-react-grid";

import "./../../../styles/subBuildingAnalysisTable.scss";

const SubBuildingAnalysisTableSingleCol = (props: any) => {
  return (
    <div>
      {props.data.length > 0 ? (
        <div className="analysis-table-container">
          <br></br>
          <header className="analysis-table-type">{props.componentType}</header>
          <div style={{ width: "100%" }}>
            <Grid
              data={props.data}
              style={{ width: "100%" }}
              scrollable="scrollable"
              fixedScroll={true}
            >
              {props.data !== undefined &&
                Object.keys(props.data[0]).map((item, index) => (
                  <GridColumn
                    //key={key}
                    field={Object.keys(props.data[0])[index]}
                    title={Object.keys(props.data[0])[index]}
                    format="{0:n2}"
                    headerClassName="custom-header-cell"
                    className={
                      Object.keys(props.data[0])[index] === ""
                        ? ""
                        : "custom-number-cell"
                    }
                    width={
                      Object.keys(props.data[0])[index].length > 6
                        ? "130%"
                        : "100%"
                    }
                  />
                ))}
            </Grid>
          </div>
          <br></br>
        </div>
      ) : (
        <div>No data available</div>
      )}
    </div>
  );
};

export default SubBuildingAnalysisTableSingleCol;