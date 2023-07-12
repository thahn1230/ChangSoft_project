import React, { useEffect, useState } from "react";
import axios from "axios";
import { Grid, GridColumn } from "@progress/kendo-react-grid";

import urlPrefix from "../../../resource/URL_prefix.json";
import "./../../../styles/subBuildingFloorAnalysisTable.scss";

interface RebarJson {
  floor_name: string;
  rebar_grade: string;
  rebar_diameter: number;
  total_rebar: number;
}

type gridData = Array<{ [key: string]: any } & { "": string }>;

const SubBuildingFloorAnalysisTable = (props: any) => {
  const [concreteData, setConcreteData] = useState<gridData>([]);
  const [formworkData, setFormworkData] = useState<gridData>([]);
  const [rebarData, setRebarData] = useState<gridData>([]);

  //const [totalData, setTotalData] = useState<gridData>([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      let concreteResponse;
      let formworkResponse;
      let rebarResponse;

      try {
        concreteResponse = await axios.get(
          urlPrefix.IP_port +
            "/sub_building/floor_analysis_table/" +
            props.buildingInfo.id +
            "/concrete"
        );
        formworkResponse = await axios.get(
          urlPrefix.IP_port +
            "/sub_building/floor_analysis_table/" +
            props.buildingInfo.id +
            "/formwork"
        );
        rebarResponse = await axios.get(
          urlPrefix.IP_port +
            "/sub_building/floor_analysis_table/" +
            props.buildingInfo.id +
            "/rebar"
        );

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
          const floorName = rebar.floor_name;
          const rebarGrade = rebar.rebar_grade;
          const rebarDiameter = rebar.rebar_diameter;
          const totalRebar = rebar.total_rebar; 
          
          const existingItem = rebarJsonGrid.find(
            (item) => item[""] === floorName
          );
          if (existingItem) {
            if (!existingItem[rebarGrade]) {
              existingItem[rebarGrade] = {};
            }
            existingItem[rebarGrade][rebarDiameter.toString()] = totalRebar;
          } else {
            const newItem = {
              "": floorName,
              [rebarGrade]: {
                [rebarDiameter.toString()]: totalRebar,
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
    console.log("after mod: ");
    console.log(rebarData);
  }, [rebarData]);

  const splitColumns = (data: gridData, count: number) => {
    const keys = Object.keys(data[0]);
    const chunks = [];
    let start = 0;
    while (start < keys.length) {
      const chunk = keys.slice(start, start + count);
      if (chunks.length > 0 && start === count) {
        chunk.unshift(keys[0]);
      }
      chunks.push(chunk);
      start += count;
    }
    return chunks;
  };

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {concreteData.length > 0 ? (
            <div>
              <br></br>
              <header className="floorAnalysisTableType">콘크리트(㎥)</header>
              {splitColumns(concreteData, 15).map((chunk, index) => (
                <div>
                  <Grid
                    key={index}
                    data={concreteData}
                    style={{ width: "100%" }}
                  >
                    {chunk.map((key) => (
                      <GridColumn
                        key={key}
                        field={key}
                        title={key}
                        format="{0:n2}"
                        headerClassName="custom-header-cell"
                        className="custom-number-cell"
                      />
                    ))}
                  </Grid>
                  <br></br>
                </div>
              ))}
              <br></br>

              <header className="floorAnalysisTableType">거푸집(㎡)</header>
              {splitColumns(formworkData, 15).map((chunk, index) => (
                <div>
                  <Grid
                    key={index}
                    data={formworkData}
                    style={{ width: "100%" }}
                  >
                    {chunk.map((key) => (
                      <GridColumn
                        key={key}
                        field={key}
                        title={key}
                        format="{0:n2}"
                        headerClassName="custom-header-cell"
                        className="custom-number-cell"
                      />
                    ))}
                  </Grid>
                  <br></br>
                </div>
              ))}
              <br></br>

              <header className="floorAnalysisTableType">철근(Ton)</header>
              {splitColumns(rebarData, 15).map((chunk, index) => (
                <div key={index}>
                  <Grid
                    key={index}
                    data={rebarData}
                    style={{ width: "100%" }}
                  >
                    {chunk.map((key) => {
                      if (key === "") {
                        return <GridColumn key={key} field={key} title="" headerClassName="custom-header-cell"/>;
                      } else if (
                        Object.keys(rebarData[0])
                          .filter((key) => key !== "")
                          .includes(key)
                      ) {
                        const subColumns = Object.keys(
                          rebarData[0][key]
                        ).filter((subColumn) => subColumn !== "");
                        return (
                          <GridColumn key={key} title={key} headerClassName="custom-header-cell">
                            {subColumns.map((subColumn) => (
                              <GridColumn
                                key={`${key}_${subColumn}`}
                                field={`${key}.${subColumn}`}
                                title={"D" + subColumn}
                                format="{0:n2}"
                                headerClassName="custom-header-cell"
                                className="custom-number-cell"
                              />
                            ))}
                          </GridColumn>
                        );
                      } else {
                        return (
                          <GridColumn
                            key={key}
                            field={key}
                            title={key}
                            format="{0:n2}"
                            headerClassName="custom-header-cell"
                            className="custom-number-cell"
                          />
                        );
                      }
                    })}
                  </Grid>
                  <br />
                </div>
              ))}
            </div>
          ) : (
            <div>No data available</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SubBuildingFloorAnalysisTable;