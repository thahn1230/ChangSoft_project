import React, { useEffect, useState } from "react";
import InsightList from "../component/insightComponent/insightList";
import InsightGraph from "../component/insightComponent/insightGraph";

interface graphInfoI {
  data: any;
  explanation: any;
  layout: any;
}

const Insight: React.FC = () => {
  const [selectedInsightIndex, setSelectedInsightIndex] = useState(-1);
  const [graphInfo, setGraphInfo] = useState<graphInfoI[]>();
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://10.221.72.46:8000/query", {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: "How many projects are there in DB?" }),
      });

      console.log(await response.json())
    };
    fetchData();
  }, []);

  return (
    <div>
      <InsightList
        setGraphInfo={setGraphInfo}
        setSelectedInsightIndex={setSelectedInsightIndex}
        setIsLoading={setIsLoading}
      ></InsightList>

      <InsightGraph
        selectedInsightIndex={selectedInsightIndex}
        graphInfo={graphInfo}
        setIsLoading={setIsLoading}
        isLoading={isLoading}
      ></InsightGraph>

      <div>asd</div>
    </div>
  );
};

export default Insight;
