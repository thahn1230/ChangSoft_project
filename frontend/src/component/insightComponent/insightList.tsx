import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import urlPrefix from "./../../resource/URL_prefix.json";
import {
  DropDownList,
  MultiSelect,
  MultiSelectChangeEvent,
} from "@progress/kendo-react-dropdowns";
import { Button } from "@progress/kendo-react-buttons";

const InsightList = (props: any) => {
  const [insightList, setInsightList] = useState<string[]>([
    "'우미건설'의 모든 프로젝트에 대해, 프로젝트별 빌딩의 콘크리트 M3당 철근량(ton) 값에 대한 분석",
    "'계룡건설'의 모든 프로젝트에 대해, 프로젝트별 빌딩의 콘크리트 M3당 철근량(ton) 값의 분포 분석 (BoxPlot)",
    "'우미건설'의 4개 프로젝트에 대해, 프로젝트별 빌딩의 콘크리트 종류별 사용비율 비교",
    "건설사별 콘크리트당 철근중량 비교",
    "'우미건설' 프로젝트에서 내력벽의 그루핑에 따른 콘크리트당 철근값의 비교",
    "'신세계 어바인시티' 프로젝트에서 층별, 부재타입별, 철근타입별로 콘크리트 당 철근 사용량 값의 대한 히트맵 분석",
  ]);
  //only in list
  const [selectedInsightInList, setSelectedInsightInList] = useState<string>();
  const [selectedInsightIndexInList, setSelectedInsightIndexInList] =
    useState(0);
  //actually selected value
  const [selectedInsightIndex, setSelectedInsightIndex] = useState(-1);

  const [constructionCompanyList, setConstructionCompanyList] = useState<
    string[]
  >([]);
  const [selectedConstructionCompanyList, setSelectedConstructionCompanyList] =
    useState<string[]>([]);

  const [projectList, setProjectList] = useState<string[]>([]);
  const [selectedProjectList, setSelectedProjectList] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          urlPrefix.IP_port + "/dashboard/project"
        );
        const data = JSON.parse(response.data);

        setProjectList(
          ["All"].concat(
            Array.from(new Set(data.map((item: any) => item.project_name)))
          )
        );
        setConstructionCompanyList(
          ["All"].concat(
            Array.from(
              new Set(data.map((item: any) => item.construction_company))
            )
          )
        );
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const onSelectedInsightChange = (e: any) => {
    setSelectedInsightIndexInList(e.target.index);
    setSelectedInsightInList(e.value);
  };

  useEffect(() => {
    props.setSelectedInsightIndex(selectedInsightIndex);
  }, [selectedInsightIndex]);

  const onButtonClick = () => {
    setSelectedInsightIndex(selectedInsightIndexInList);
  };

  const onNewConstructionCompanySelection = (event: MultiSelectChangeEvent) => {
    console.log(event);
    if (event.value.includes("All"))
     {
        setSelectedConstructionCompanyList(constructionCompanyList);
    } else {
      setSelectedConstructionCompanyList([...event.value]);
    }
  };

  const onNewProjectSelection = (event: MultiSelectChangeEvent) => {
    setSelectedProjectList([...event.value]);
  };

  return (
    <div>
      <label>Insight : </label>
      <DropDownList
        data={insightList}
        value={selectedInsightInList}
        onChange={onSelectedInsightChange}
        style={{ width: "30%", margin: "10px" }}
      />
      <Button onClick={onButtonClick}>Search</Button>

      <MultiSelect
        style={{ width: "20%", margin: "10px" }}
        data={constructionCompanyList}
        value={selectedConstructionCompanyList}
        onChange={onNewConstructionCompanySelection}
      />
      <MultiSelect
        style={{ width: "20%", margin: "10px" }}
        data={projectList}
        value={selectedProjectList}
        onChange={onNewProjectSelection}
      />
    </div>
  );
};

export default InsightList;
