import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import axios from "axios";
import urlPrefix from "../../resource/URL_prefix.json";
import spinner from "./../../resource/loadingBars.gif";

interface graphInfoI {
  data: any;
  explanation: any;
  layout: any;
}

const InsightGraph = (props: any) => {
  const [returnDiv, setReturnDiv] = useState<JSX.Element[]>([]);

  useEffect(() => {
    let newRes: JSX.Element[] = [];
    if (props.graphInfo !== undefined) {

      console.log("insight data:")
      console.log(JSON.stringify(props.graphInfo))

      for (let idx = 0; idx < props.graphInfo.length; idx++) {
        newRes.push(
          <div style={{ marginLeft: "8vw" }}>
            <div
              style={{
                width: "80vw",
                overflow: "scroll",
              }}
            >
              <Plot
                data={props.graphInfo[idx].data}
                layout={props.graphInfo[idx].layout}
                style={{ display: "inline-block" }}
              />
            </div>
            <p
              style={{
                textAlign: "left",
                width: "80vw",
              }}
            >
              {" "}
              {props.graphInfo[idx].explanation}
            </p>
            <br></br>
            <br></br>
            <hr
              style={{ border: "solid 1px", color: "#162F84", width: "1000px" }}
            />
            <br></br>
            <br></br>
          </div>
        );
      }
    }
    setReturnDiv(newRes);
  }, [props.graphInfo]);

  useEffect(() => {
    if (returnDiv.length !== 0) props.setIsLoading(false);
  }, [returnDiv]);

  return (
    <div style={{ justifyContent: "center", alignItems: "center" }}>
      <div>
        {props.isLoading ? (
          <img
            alt="loader"
            src={spinner}
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: "10%",
            }}
          />
        ) : (
          returnDiv
        )}
      </div>
    </div>
  );
};

export default InsightGraph;
