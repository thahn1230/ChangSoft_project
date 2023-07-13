import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Grid, GridColumn, GridEvent } from "@progress/kendo-react-grid";

import urlPrefix from "../../../resource/URL_prefix.json";
import "./../../../styles/subBuildingAnalysisTable.scss";

interface RebarJson {
  component_type: string;
  rebar_grade: string;
  rebar_diameter: number;
  total_weight: number;
}

type gridData = Array<{ [key: string]: any } & { "": string }>;

const SubBuildingAnalysisTable = (props: any) => {
  const [concreteData, setConcreteData] = useState<gridData>([]);
  const [formworkData, setFormworkData] = useState<gridData>([]);
  const [rebarData, setRebarData] = useState<gridData>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [rebarColumns, setRebarColumns] = useState<{}[]>();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      let concreteResponse;
      let formworkResponse;
      let rebarResponse;

      try {
        if (props.selectedSubBuildingId === 0) {
          concreteResponse = await axios.get(
            urlPrefix.IP_port +
              "/sub_building/analysis_table_all/" +
              props.buildingInfo.id +
              "/concrete"
          );
          formworkResponse = await axios.get(
            urlPrefix.IP_port +
              "/sub_building/analysis_table_all/" +
              props.buildingInfo.id +
              "/formwork"
          );
          rebarResponse = await axios.get(
            urlPrefix.IP_port +
              "/sub_building/analysis_table_all/" +
              props.buildingInfo.id +
              "/rebar"
          );
        } else {
          concreteResponse = await axios.get(
            urlPrefix.IP_port +
              "/sub_building/analysis_table/" +
              props.selectedSubBuildingId +
              "/concrete"
          );
          formworkResponse = await axios.get(
            urlPrefix.IP_port +
              "/sub_building/analysis_table/" +
              props.selectedSubBuildingId +
              "/formwork"
          );
          rebarResponse = await axios.get(
            urlPrefix.IP_port +
              "/sub_building/analysis_table/" +
              props.selectedSubBuildingId +
              "/rebar"
          );
        }

        const concreteJson = JSON.parse(concreteResponse.data);
        const formworkJson = JSON.parse(formworkResponse.data);
        const rebarJson: RebarJson[] = JSON.parse(rebarResponse.data);

        const concreteJsonGrid: gridData = Object.entries(concreteJson).map(
          ([key, value]) => {
            const newObj: { [key: string]: any } = { "": key };
            for (const prop in value as Record<string, any>) {
              newObj[prop] = (value as Record<string, any>)[prop];
            }
            return newObj as { [key: string]: any } & { "": string };
          }
        );
        const formworkJsonGrid: gridData = Object.entries(formworkJson).map(
          ([key, value]) => {
            const newObj: { [key: string]: any } = { "": key };
            for (const prop in value as Record<string, any>) {
              newObj[prop] = (value as Record<string, any>)[prop];
            }
            return newObj as { [key: string]: any } & { "": string };
          }
        );

        const rebarJsonGrid: gridData = [];
        for (const rebar of rebarJson) {
          const componentType = rebar.component_type;
          const rebarGrade = rebar.rebar_grade;
          const rebarDiameter = rebar.rebar_diameter;
          const totalWeight = rebar.total_weight;

          const existingItem = rebarJsonGrid.find(
            (item) => item[""] === componentType
          );
          if (existingItem) {
            if (!existingItem[rebarGrade]) {
              existingItem[rebarGrade] = {};
            }
            existingItem[rebarGrade][rebarDiameter.toString()] = totalWeight;
          } else {
            const newItem = {
              "": componentType,
              [rebarGrade]: {
                [rebarDiameter.toString()]: totalWeight,
              },
            };
            rebarJsonGrid.push(newItem);
          }
        }

        setConcreteData(concreteJsonGrid);
        setFormworkData(formworkJsonGrid);
        setRebarData(rebarJsonGrid);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [props]);

  useEffect(() => {
    const temp: string[] = [];
    const tempRebarColumns = [{}];
    rebarData.map((item, index) => {
      Object.entries(item).map((cols) => {
        temp.push(cols[0]);
      });
    });
    temp.sort();
    const tempSet = new Set(temp);


    Array.from(tempSet).map((strength) => {
      const DiametersInStrength: string[] = rebarData.reduce(
        (keys: string[], obj) => {
          for (const key in obj) {
            if (key === strength) {
              keys.push(...Object.keys(obj[key]));
            }
          }
          keys.sort();
          const keysSet = new Set(keys);
          return Array.from(keysSet);
        },
        []
      );

      tempRebarColumns.push({ [strength]: DiametersInStrength });
    });

    setRebarColumns(tempRebarColumns);
  }, [rebarData]);

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {concreteData.length > 0 ? (
            <div>
              <div className="analysis-table-container">
                <br></br>
                <header className="analysis-table-type">콘크리트(㎥)</header>
                <div style={{width:"100%"}}>
                  <Grid
                    data={concreteData}
                    style={{ width: "100%" }}
                    scrollable="scrollable"
                    fixedScroll={true}
                  >
                    {concreteData !== undefined &&
                      Object.keys(concreteData[0]).map((item, index) => (
                        <GridColumn
                          //key={key}
                          field={Object.keys(concreteData[0])[index]}
                          title={Object.keys(concreteData[0])[index]}
                          format="{0:n2}"
                          headerClassName="custom-header-cell"
                          className={Object.keys(concreteData[0])[index]==="" ? "" : "custom-number-cell"}
                          width={Object.keys(concreteData[0])[index].length >6 ? "130%": "100%"}
                        />
                      ))}
                  </Grid>
                </div>
                <br></br>
              </div>

              <div className="analysis-table-container">
                <header className="analysis-table-type">거푸집(㎡)</header>
                <div style={{width:"100%"}}>
                  <Grid
                    data={formworkData}
                    style={{ width: "100%" }}
                    scrollable="scrollable"
                    fixedScroll={true}
                  >
                    {formworkData !== undefined &&
                      Object.keys(formworkData[0]).map((item, index) => (
                        <GridColumn
                          //key={key}
                          field={Object.keys(formworkData[0])[index]}
                          title={Object.keys(formworkData[0])[index]}
                          format="{0:n2}"
                          headerClassName="custom-header-cell"
                          className={Object.keys(formworkData[0])[index]==="" ? "" : "custom-number-cell"}
                          width={Object.keys(formworkData[0])[index].length >6 ? "130%": "100%"}
                        />
                      ))}
                  </Grid>
                </div>
                <br></br>
              </div>

              <div className="analysis-table-container">
                <header className="analysis-table-type">철근(Ton)</header>
                <div style={{width:"100%"}}>
                  <Grid
                    data={rebarData}
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
                    {rebarColumns !== undefined &&
                      rebarColumns.map((item: { [key: string]: any }) => {
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
                                  title= {"D" + diameter}
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
      )}
    </div>
  );
};

export default SubBuildingAnalysisTable;
