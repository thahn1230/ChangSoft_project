import React, { useEffect, useState, useRef } from "react";
import { DropDownList, ComboBox } from "@progress/kendo-react-dropdowns";
import { Button } from "@progress/kendo-react-buttons";

const InsightList = (props:any) => {
  const [insightList, setInsightList] = useState<string[]>([
    "'우미건설'의 모든 프로젝트에 대해, 프로젝트별 빌딩의 콘크리트 M3당 철근량(ton) 값에 대한 분석",
    "'계룡건설'의 모든 프로젝트에 대해, 프로젝트별 빌딩의 콘크리트 M3당 철근량(ton) 값의 분포 분석 (BoxPlot)",
  ]);
  //only in list
  const [selectedInsightInList, setSelectedInsightInList] = useState<string>();
  const [selectedInsightIndexInList, setSelectedInsightIndexInList] = useState(0);
  //actually selected
  const [selectedInsightIndex, setSelectedInsightIndex]=useState(-1);
  const onSelectedInsightChange = (e: any) => {
    setSelectedInsightIndexInList(e.target.index)
    setSelectedInsightInList(e.value);
  };

  const onButtonClick = () => {
    setSelectedInsightIndex(selectedInsightIndexInList);
  };

  useEffect(() => {
    props.setSelectedInsightIndex(selectedInsightIndex);
  }, [selectedInsightIndex]);

  return (
    <div>
      <DropDownList
        data={insightList}
        value={selectedInsightInList}
        onChange={onSelectedInsightChange}
        style={{ width: "100%" }}
      />
      <Button onClick={onButtonClick}>apply</Button>
    </div>
  );
};

export default InsightList;
