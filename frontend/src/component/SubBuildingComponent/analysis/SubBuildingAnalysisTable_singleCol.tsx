import React, { useEffect } from "react";
import { Grid, GridColumn, GridEvent } from "@progress/kendo-react-grid";

import "styles/subBuildingAnalysisTable.scss";

const SingleColTable = (props: any) => {
  return (
    <div>
      {props.data.length > 0 ? (
        <div className="analysis-table-container">
          <div>
            <Grid
              data={props.data}
              style={{ width: "100%", height: "60vh" }}
              scrollable="scrollable"
              fixedScroll={true}
            >
              {props.data !== undefined &&
                Object.keys(props.data[0]).map((item, index) => {
                  return (
                    <GridColumn
                      key={index}
                      field={Object.keys(props.data[0])[index]}
                      title={Object.keys(props.data[0])[index]}
                      format="{0:n2}"
                      headerClassName="custom-header-cell"
                      className={
                        Object.keys(props.data[0])[index] === ""
                          ? ""
                          : "custom-number-cell"
                      }
                      width={"130"}
                    />
                  );
                })}
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

export default SingleColTable;
