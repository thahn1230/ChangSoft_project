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
      <q>
        이 DB는 현재 Demo의 목적으로 공개되고 있습니다. DB에 나타나는 건설사나 프로젝트는 가공된 데이터로 실제의 건설사나, 프로젝트와는 관련이 없습니다.
      </q>
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
