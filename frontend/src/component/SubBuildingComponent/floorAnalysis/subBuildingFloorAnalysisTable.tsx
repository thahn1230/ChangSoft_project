import React, { useEffect, useState } from "react";
import axios from "axios";
import { Grid, GridColumn } from "@progress/kendo-react-grid";

import urlPrefix from "../../../resource/URL_prefix.json";

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
        const rebarJson = JSON.parse(rebarResponse.data);

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
        const rebarJsonGrid: gridData = Object.entries(rebarJson).map(
          ([key, value]) => {
            const newObj: { [key: string]: any } = { "": key };
            for (const prop in value as Record<string, any>) {
              newObj[prop] = (value as Record<string, any>)[prop];
            }
            return newObj as { [key: string]: any } & { "": string };
          }
        );
        setConcreteData(concreteJsonGrid);
        setFormworkData(formworkJsonGrid);
        setRebarData(rebarJsonGrid);

        console.log(concreteJson)
        console.log(concreteJsonGrid)

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [props]);

  return (
    <div>
        <header>{props.projectName} {props.buildingInfo.building_name} </header>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {concreteData.length > 0 ? (
            <div>
              <br></br>
              <header style={{ paddingLeft: "20px", textAlign: "left" }}>
                콘크리트(㎥)
              </header>
              <Grid data={concreteData} style={{ width: "100%" }}>
                {Object.keys(concreteData[0]).map((key) => (
                  <GridColumn
                    key={key}
                    field={key}
                    title={key}
                    format={"{0:n2}"}
                  />
                ))}
              </Grid>
              <br></br>

              <header style={{ paddingLeft: "20px", textAlign: "left" }}>
                거푸집(㎡)
              </header>
              <Grid data={formworkData} style={{ width: "100%" }}>
                {Object.keys(formworkData[0]).map((key) => (
                  <GridColumn
                    key={key}
                    field={key}
                    title={key}
                    format={"{0:n2}"}
                  />
                ))}
              </Grid>
              <br></br>

              <header style={{ paddingLeft: "20px", textAlign: "left" }}>
                철근(Ton)
              </header>
              <Grid data={rebarData} style={{ width: "100%" }}>
                {Object.keys(rebarData[0]).map((key) => (
                  <GridColumn
                    key={key}
                    field={key}
                    title={key}
                    format={"{0:n2}"}
                  />
                ))}
              </Grid>
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
