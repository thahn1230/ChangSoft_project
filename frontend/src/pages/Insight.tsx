import React, { useEffect, useState } from "react";
import InsightList from "component/insightComponent/InsightList";
import InsightGraph from "component/insightComponent/InsightGraph";

interface graphInfoI {
  data: any;
  explanation: any;
  layout: any;
}

const Insight: React.FC = (props:any) => {
  const [selectedInsightIndex, setSelectedInsightIndex] = useState(-1);
  const [graphInfo, setGraphInfo] = useState<graphInfoI[]>();
  const [isLoading, setIsLoading] = useState(false);

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
    </div>
  );
};

export default Insight;
