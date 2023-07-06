import React, { useEffect, useState } from "react";
import { Loader, LoaderType } from "@progress/kendo-react-indicators";
import InsightList from "../component/insightComponent/insightList";
import InsightGraph from "../component/insightComponent/insightGraph";

const Insight: React.FC = () => {
  const [selectedInsightIndex, setSelectedInsightIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log(isLoading);
  }, [isLoading]);

  return (
    <div>
      <InsightList
        setSelectedInsightIndex={setSelectedInsightIndex}
        setIsLoading={setIsLoading}
      ></InsightList>

      {isLoading && <Loader size="large" type={"infinite-spinner"} />}

      <InsightGraph
        selectedInsightIndex={selectedInsightIndex}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      ></InsightGraph>
    </div>
  );
};

export default Insight;
