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
