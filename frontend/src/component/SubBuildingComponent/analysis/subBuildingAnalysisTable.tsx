import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Grid, GridColumn, GridEvent } from "@progress/kendo-react-grid";

import urlPrefix from "../../../resource/URL_prefix.json";
import "./../../../styles/subBuildingAnalysisTable.scss";

// interface RebarJson {
//   component_type: string;
//   rebar_grade: string;
//   rebar_diameter: number;
//   total_weight: number;
// }

// type gridData = Array<{ [key: string]: any } & { "": string }>;

const SubBuildingAnalysisTable = (props: any) => {
  return (
    <div>
      {props.concreteData.length > 0 ? (
        <div>
          <div className="analysis-table-container">
            <br></br>
            <header className="analysis-table-type">콘크리트(㎥)</header>
            <div style={{ width: "100%" }}>
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
          </div>

          <div className="analysis-table-container">
            <header className="analysis-table-type">거푸집(㎡)</header>
            <div style={{ width: "100%" }}>
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
          </div>

          <div className="analysis-table-container">
            <header className="analysis-table-type">철근(Ton)</header>
            <div style={{ width: "100%" }}>
              <Grid
                data={props.rebarData}
                style={{ width: "100%" }}
                scrollable="scrollable"
                fixedScroll={true}
              >
                <GridColumn
                  title=""
                  field=""
                  headerClassName="custom-header-cell"
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
        </div>
      ) : (
        <div>No data available</div>
      )}
    </div>
  );
};

export default SubBuildingAnalysisTable;
