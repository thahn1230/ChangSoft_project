import React, { useEffect, useState, useRef } from "react";
import { DropDownList, ComboBox } from "@progress/kendo-react-dropdowns";
import { Button } from "@progress/kendo-react-buttons";

const InsightList = (props:any) => {
  const [insightList, setInsightList] = useState<string[]>([
    "'우미건설'의 모든 프로젝트에 대해, 프로젝트별 빌딩의 콘크리트 M3당 철근량(ton) 값에 대한 분석",
    "'계룡건설'의 모든 프로젝트에 대해, 프로젝트별 빌딩의 콘크리트 M3당 철근량(ton) 값의 분포 분석 (BoxPlot)",
    "'우미건설'의 4개 프로젝트에 대해, 프로젝트별 빌딩의 콘크리트 종류별 사용비율 비교",
    "건설사별 콘크리트당 철근중량 비교",
    "'우미건설' 프로젝트에서 내력벽의 그루핑에 따른 콘크리트당 철근값의 비교",
    "'신세계 어바인시티' 프로젝트에서 층별, 부재타입별, 철근타입별로 콘크리트 당 철근 사용량 값의 대한 히트맵 분석"
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
        style={{ width: "30%" ,margin:"10px"}}
      />
      <Button onClick={onButtonClick}>apply</Button>
    </div>
  );
};

export default InsightList;
