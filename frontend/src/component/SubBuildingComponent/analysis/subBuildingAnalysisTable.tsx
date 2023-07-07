import React, { useEffect, useState } from "react";
import axios from "axios";
import { Grid, GridColumn } from "@progress/kendo-react-grid";

import urlPrefix from "../../../resource/URL_prefix.json";

type gridData = Array<{ [key: string]: any } & { "": string }>;

const SubBuildingAnalysisTable = (props: any) => {
  const [concreteData, setConcreteData] = useState<gridData>([]);
  const [formworkData, setFormworkData] = useState<gridData>([]);
  const [rebarData, setRebarData] = useState<gridData>([]);

  const [totalData, setTotalData] = useState<gridData>([]);

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
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (isLoading === true) return;

    const combinedData: gridData = concreteData.map((concreteItem) => {
      const key = concreteItem[""];
      const formworkItem = formworkData.find((item) => item[""] === key);
      const rebarItem = rebarData.find((item) => item[""] === key);

      return {
        ...concreteItem,
        ...formworkItem,
        ...rebarItem,
      };
    });

    setTotalData(combinedData);

  }, [isLoading]);

useEffect(()=>{
  console.log(totalData);
},[totalData])


  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {totalData.length > 0 ? (
            <Grid data={totalData} style={{ width: "100%" }}>
              {Object.keys(totalData[0])
                .map((key) => (
                  <GridColumn
                    key={key}
                    field={key}
                    title={key}
                    format={"{0:n2}"}
                  />
                ))}
            </Grid>
          ) : (
            <div>No data available</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SubBuildingAnalysisTable;
