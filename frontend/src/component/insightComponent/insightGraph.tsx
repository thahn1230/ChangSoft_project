import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import axios from "axios";
import urlPrefix from "./../../resource/URL_prefix.json";

interface resI {
  data: any;
  explanation: any;
  layout: any;
}

const InsightGraph = (props: any) => {
  const [res, setRes] = useState<resI[]>();
  const [returnDiv, setReturnDiv] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setReturnDiv([]);

        if (parseInt(props.selectedInsightIndex) !== -1) {
          const response1 = await axios.get(
            urlPrefix.IP_port + "/insight/" + (props.selectedInsightIndex + 1)
          );

          const response_json = JSON.parse(response1.data);
          setRes(response_json);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [props]);

  useEffect(() => {
    let newRes: JSX.Element[] = [];
    if (res !== undefined) {
      for (let idx = 0; idx < res.length; idx++) {
        newRes.push(
          <div>
            {" "}
            <Plot data={res[idx].data} layout={res[idx].layout} />
            <p> {res[idx].explanation}</p>
          </div>
        );
      }
    }
    setReturnDiv(newRes);
  }, [res]);

  useEffect(() => {
    if (returnDiv.length !== 0) props.setIsLoading(false);
  }, [returnDiv]);

  return <div>{returnDiv}</div>;
};

export default InsightGraph;
