import React, { useEffect, useState } from "react";
import axios from "axios";
import { Grid, GridColumn } from "@progress/kendo-react-grid";

import urlPrefix from "../../../resource/URL_prefix.json";
import "./../../../styles/subBuildingAnalysisTable.scss"

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
        setIsLoading(true);

        let concreteResponse;
        let formworkResponse;
        let rebarResponse;

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
        const rebarJson = JSON.parse(rebarResponse.data);

        console.log("rebarJson : ")
        console.log(rebarJson)

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
  }, [props]);

  //to set TotalData
  // useEffect(() => {
  //   if (isLoading === true) return;

  //   const combinedData: gridData = concreteData.map((concreteItem) => {
  //     const key = concreteItem[""];
  //     const formworkItem = formworkData.find((item) => item[""] === key);
  //     const rebarItem = rebarData.find((item) => item[""] === key);

  //     return {
  //       ...concreteItem,
  //       ...formworkItem,
  //       ...rebarItem,
  //     };
  //   });

  //   setTotalData(combinedData);
  // }, [isLoading]);

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {concreteData.length > 0 ? (
            <div>
              <br></br>
              <header className="analysis-table-type">
                콘크리트(㎥)
              </header>
              <Grid data={concreteData} style={{ width: "100%" }}>
                {Object.keys(concreteData[0]).map((key) => (
                  <GridColumn
                    key={key}
                    field={key}
                    title={key}
                    format={"{0:n2}"}
                    headerClassName="custom-header-cell"
                    className="custom-number-cell"
                  />
                ))}
              </Grid>
              <br></br>

              <header className="analysis-table-type" >
                거푸집(㎡)
              </header>
              <Grid data={formworkData} style={{ width: "100%" }}>
                {Object.keys(formworkData[0]).map((key) => (
                  <GridColumn
                    key={key}
                    field={key}
                    title={key}
                    format={"{0:n2}"}
                    headerClassName="custom-header-cell"
                    className="custom-number-cell"
                  />
                ))}
              </Grid>
              <br></br>

              <header className="analysis-table-type" >
                철근(Ton)
              </header>
              <Grid data={rebarData} style={{ width: "100%" }}>
                {Object.keys(rebarData[0]).map((key) => (
                  <GridColumn
                    key={key}
                    field={key}
                    title={key}
                    format={"{0:n2}"}
                    headerClassName="custom-header-cell"
                    className="custom-number-cell"
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

export default SubBuildingAnalysisTable;
