import React, { useEffect, useState } from "react";
import axios from "axios";
import { Grid, GridColumn } from "@progress/kendo-react-grid";

import urlPrefix from "../../../resource/URL_prefix.json";

type gridData = Array<{ [key: string]: any } & { "": string }>;

const SubBuildingAnalysisTable = (props: any) => {
  const [concreteData, setConcreteData] = useState<gridData>([]);
  const [formworkData, setFormworkData] = useState<gridData>([]);
  const [rebarData, setRebarData] = useState<gridData>([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const concreteResponse = await axios.get(
          urlPrefix.IP_port +
            "/sub_building/analysis_table/" +
            "113" +
            "/concrete"
        );
        const formworkResponse = await axios.get(
          urlPrefix.IP_port +
            "/sub_building/analysis_table/" +
            "113" +
            "/formwork"
        );
        const rebarResponse = await axios.get(
          urlPrefix.IP_port + "/sub_building/analysis_table/" + "113" + "/rebar"
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

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (formworkData.length <= 0 || rebarData.length <= 0) return;
    //console.log(formworkData);
    //console.log(Object.keys(formworkData[0]));

    console.log(rebarData);
    console.log(rebarData[0]);
    // formworkData.forEach((item
    console.log(formworkData);
    console.log(formworkData[0])
    //   Object.entries(item).forEach(([key, value]) => {
    //     console.log(`${key}: ${typeof value}`);
    //   });
    // });
    // rebarData.forEach((item) => {
    //   Object.entries(item).forEach(([key, value]) => {
    //     console.log(`${key}: ${typeof value}`);
    //   });
    // });
    //Object.keys(rebarData[0]).map((key) => console.log(key));
    //Object.keys(formworkData[0]).map((key) => console.log(key));
  }, [formworkData]);

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <Grid data={concreteData}>
            {concreteData.length > 0 &&
              Object.keys(concreteData[0]).map((key) => (
                <GridColumn key={key} field={key} title={key} />
              ))}
          </Grid>
          <Grid data={formworkData}>
            {formworkData.length > 0 &&
              Object.keys(formworkData[0]).map((key) => (
                <GridColumn key={key} field={key} title={key} />
              ))}
          </Grid>
          <Grid data={rebarData}>
            {rebarData.length > 0 &&
              Object.keys(rebarData[0]).map((key) => (
                <GridColumn key={key} field={key} title={key} />
              ))}
          </Grid>
        </div>
      )}
    </div>
  );
};

export default SubBuildingAnalysisTable;
