import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import axios from "axios";
import urlPrefix from "./../../resource/URL_prefix.json";
import spinner from "./../../resource/loadingBars.gif";

interface resI {
  data: any;
  explanation: any;
  layout: any;
}

const InsightGraph = (props: any) => {
  const [res, setRes] = useState<resI[]>();
  const [returnDiv, setReturnDiv] = useState<JSX.Element[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setReturnDiv([]);

        if (parseInt(props.selectedInsightIndex) !== -1) {
          setIsLoading(true);
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
      console.log(res)
      for (let idx = 0; idx < res.length; idx++) {
        newRes.push(
          <div style={{textAlign:"center"}}>
            <Plot data={res[idx].data} layout={res[idx].layout} style={{display:"inline-block"}} />
            <p style={{textAlign:"left", width:"80%",display:"inline-block"}}> {res[idx].explanation}</p>
            <br></br><br></br>
            <hr style={{border:"solid 1px" ,color:"#162F84", width:"1000px"}}/>
            <br></br><br></br>
          </div>
        );
      }
    }
    setReturnDiv(newRes);
  }, [res]);

  useEffect(() => {
    if (returnDiv.length !== 0) setIsLoading(false);
  }, [returnDiv]);

  useEffect(() => {
    console.log(res);
  }, [res]);

  return (
    <div>
      <hr style={{border:"solid 1px" ,color:"#162F84", width:"1000px"}}/>
      {/* {isLoading ? <Loader size="large" type={"infinite-spinner"} /> : returnDiv} */}
      { isLoading ? <img alt="loader" src={spinner} /> : returnDiv }
      {/* {returnDiv} */}
    </div>
  );
};

export default InsightGraph;
