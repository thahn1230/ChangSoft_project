import React, { useEffect, useState } from "react";
import InsightList from "../component/insightComponent/insightList";
import InsightGraph from "../component/insightComponent/insightGraph";

const Insight: React.FC = () => {
  const [selectedInsightIndex, setSelectedInsightIndex] = useState(-1);


  return (
    <div>
      <InsightList
        setSelectedInsightIndex={setSelectedInsightIndex}
      ></InsightList>


      <InsightGraph
        selectedInsightIndex={selectedInsightIndex}
      ></InsightGraph>
    </div>
  );
};

export default Insight;
