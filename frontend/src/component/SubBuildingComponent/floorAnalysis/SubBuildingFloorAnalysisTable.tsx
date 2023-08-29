import React from "react";
import { Grid, GridColumn } from "@progress/kendo-react-grid";

import "styles/subBuildingFloorAnalysisTable.scss";

const SubBuildingFloorAnalysisTable = (props: any) => {

  return (
    <div>
      {props.concreteData.length > 0 ? (
        <div>
          <br></br>
          <header className="floorAnalysisTableType">콘크리트(㎥)</header>
          <div>
            <Grid
              data={props.concreteData}
              style={{ width: "100%" }}
              scrollable="scrollable"
              fixedScroll={true}
            >
              {props.concreteData !== undefined &&
                Object.keys(props.concreteData[0]).map((item, index) => (
                  <GridColumn
                    //key={key}
                    field={Object.keys(props.concreteData[0])[index]}
                    title={Object.keys(props.concreteData[0])[index]}
                    format="{0:n2}"
                    headerClassName="custom-header-cell"
                    className={
                      Object.keys(props.concreteData[0])[index] === ""
                        ? ""
                        : "custom-number-cell"
                    }
                    width={
                      Object.keys(props.concreteData[0])[index].length > 6
                        ? "130%"
                        : "100%"
                    }
                  />
                ))}
            </Grid>
          </div>
          <br></br>

          <header className="floorAnalysisTableType">거푸집(㎡)</header>
          <div>
            <Grid
              data={props.formworkData}
              style={{ width: "100%" }}
              scrollable="scrollable"
              fixedScroll={true}
            >
              {props.formworkData !== undefined &&
                Object.keys(props.formworkData[0]).map((item, index) => (
                  <GridColumn
                    //key={key}
                    field={Object.keys(props.formworkData[0])[index]}
                    title={Object.keys(props.formworkData[0])[index]}
                    format="{0:n2}"
                    headerClassName="custom-header-cell"
                    className={
                      Object.keys(props.formworkData[0])[index] === ""
                        ? ""
                        : "custom-number-cell"
                    }
                    width={
                      Object.keys(props.formworkData[0])[index].length > 6
                        ? "130%"
                        : "100%"
                    }
                  />
                ))}
            </Grid>
          </div>
          <br></br>

          <header className="floorAnalysisTableType">철근(Ton)</header>
          <div>
            <Grid data={props.rebarData} scrollable="scrollable" fixedScroll={true}>
              <GridColumn
                title=""
                field=""
                headerClassName="custom-header-cell"
                className="custom-number-cell"
                width={"100%"}
              ></GridColumn>
              {props.rebarColumns !== undefined &&
                props.rebarColumns.map((item: { [key: string]: any }) => {
                  const strengthName = Object.keys(item)[0];
                  const subColumns = item[strengthName];

                  return Object.keys(item)[0] !== "" &&
                    Object.keys(item)[0] !== undefined ? (
                    <GridColumn
                      title={Object.keys(item)[0]}
                      headerClassName="custom-header-cell"
                      className="custom-number-cell"
                    >
                      {subColumns.map((diameter: string) => {
                        return (
                          <GridColumn
                            title={"D" + diameter}
                            field={strengthName + "." + diameter}
                            format="{0:n2}"
                            headerClassName="custom-header-cell"
                            className="custom-number-cell"
                            width={"100%"}
                          ></GridColumn>
                        );
                      })}
                    </GridColumn>
                  ) : null;
                })}
            </Grid>
          </div>
        </div>
      ) : (
        <div>No data available</div>
      )}
    </div>
  );
};

export default SubBuildingFloorAnalysisTable;
