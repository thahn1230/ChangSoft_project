import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import urlPrefix from "./../../resource/URL_prefix.json";
import {
  DropDownList,
  MultiSelect,
  MultiSelectChangeEvent,
  MultiSelectTree,
  MultiSelectTreeChangeEvent,
  MultiSelectTreeExpandEvent,
  getMultiSelectTreeValue,
} from "@progress/kendo-react-dropdowns";
import {
  CompositeFilterDescriptor,
  filterBy,
  FilterDescriptor,
} from "@progress/kendo-data-query";
import { Button } from "@progress/kendo-react-buttons";
import { getter, setter } from "@progress/kendo-react-common";
import { itemIndexStartsWith } from "@progress/kendo-react-dropdowns/dist/npm/common/utils";
import { filter } from "@progress/kendo-data-query/dist/npm/transducers";

const dataItemKey = "id";
const checkField = "checkField";
const checkIndeterminateField = "checkIndeterminateField";
const expandField = "expanded";
// const projectsTextField = "projectName";
// const constructionCompanyTextField = "constructionCompany";

const selectDropDownFields = {
  dataItemKey,
  checkField,
  checkIndeterminateField,
  expandField,
  //subItemsField,
};

const InsightList = (props: any) => {
  const [insightList, setInsightList] = useState<string[]>([
    "건설사(선택)의 프로젝트들(선택)에 대해, 프로젝트별 빌딩의 콘크리트 M3당 철근량(ton) 값에 대한 분석",
    "건설사(선택)의 프로젝트들(선택)에 대해, 프로젝트별 빌딩의 콘크리트 M3당 철근량(ton) 값의 분포 분석 (BoxPlot)",
    "건설사(선택)의 프로젝트들(선택)에 대해, 프로젝트별 빌딩의 콘크리트 종류별 사용비율 비교",
    "건설사들(선택)에 대한 콘크리트당 철근중량 비교",
    "건설사(선택)의 한 프로젝트(선택)에서 내력벽의 그루핑에 따른 콘크리트당 철근값의 비교",
    "건설사(선택)의 한 프로젝트(선택)에 대해서 층별, 부재타입별로 철근 타입별로 콘크리트당 철근사용량의 값을 한눈에 보여주는 히트맵 분석",
  ]);

  //only in list
  const [selectedInsightInList, setSelectedInsightInList] = useState<string>();
  const [selectedInsightIndexInList, setSelectedInsightIndexInList] =
    useState(0);
  //actually selected value
  const [selectedInsightIndex, setSelectedInsightIndex] = useState(-1);

  //constructionCompanyList's id is useless
  const [constructionCompanyList, setConstructionCompanyList] = useState<
    { constructionCompany: string; id: number }[]
  >([]);
  const [selectedConstructionCompanyList, setSelectedConstructionCompanyList] =
    useState<{ constructionCompany: string; id: number }[]>([]);

  const [projectList, setProjectList] = useState<
    { projectName: string; id: number; constructionCompany: string }[]
  >([{ projectName: "All", id: 0, constructionCompany: "All" }]);
  const [filteredProjectList, setFilteredProjectList] = useState<
    { projectName: string; id: number; constructionCompany: string }[]
  >([]);
  const [selectedProjectList, setSelectedProjectList] = useState<
    { projectName: string; id: number; constructionCompany: string }[]
  >([]);
  //const [expandedProject, setExpandedProject] = useState<string[]>([]);

  const [projectFilter, setProjectFilter] = useState<CompositeFilterDescriptor>(
    {
      logic: "or",
      filters: [],
    }
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          urlPrefix.IP_port + "/dashboard/project"
        );
        const data = JSON.parse(response.data);

        setProjectList(
          projectList.concat(
            data.map((item: any) => {
              return {
                projectName: item.project_name,
                id: item.id,
                constructionCompany: item.construction_company,
              };
            })
          )
        );

        const uniqueConstructionCompanies = Array.from(
          new Set(data.map((item: any) => item.construction_company))
        );
        setConstructionCompanyList(
          [{ constructionCompany: "All", id: 0 }].concat(
            uniqueConstructionCompanies.map((constructionCompany: any) => {
              const item = data.find(
                (item: any) => item.construction_company === constructionCompany
              );
              return { constructionCompany, id: item.id };
            })
          )
        );
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setFilteredProjectList(projectList);
  }, [projectList]);

  // set filter here
  useEffect(() => {
    setProjectFilter({
      logic: "or",
      filters: [],
    });

    let newProjectFilter: CompositeFilterDescriptor = {
      logic: "or",
      filters: [{ field: "constructionCompany", operator: "eq", value: "All" }],
    };

    for (let item of selectedConstructionCompanyList) {
      newProjectFilter.filters.push({
        field: "constructionCompany",
        operator: "eq",
        value: item.constructionCompany,
      });
    }

    setProjectFilter(newProjectFilter);
  }, [selectedConstructionCompanyList]);

  useEffect(() => {
    console.log(projectFilter);
    setFilteredProjectList(filterBy(projectList, projectFilter));
  }, [projectFilter]);

  const onSelectedInsightChange = (e: any) => {
    setSelectedInsightIndexInList(e.target.index);
    setSelectedInsightInList(e.value);
  };

  const onButtonClick = () => {
    props.setSelectedInsightIndex(selectedInsightIndexInList);
    setSelectedInsightIndex(selectedInsightIndexInList);
  };

  // 여기에서는 선택된 건설회사만 set
  const onNewConstructionCompanySelection = (
    event: MultiSelectTreeChangeEvent
  ) => {
    if (event.items[0].constructionCompany === "All") {
      setSelectedConstructionCompanyList(
        getMultiSelectTreeValue(constructionCompanyList, {
          ...selectDropDownFields,
          ...event,
          value: constructionCompanyList,
        })
      );
    } else {
      setSelectedConstructionCompanyList(
        getMultiSelectTreeValue(constructionCompanyList, {
          ...selectDropDownFields,
          ...event,
          value: selectedConstructionCompanyList,
        })
      );
    }
  };

  const onNewProjectSelection = (event: MultiSelectTreeChangeEvent) => {
    setSelectedProjectList(
      getMultiSelectTreeValue(projectList, {
        ...selectDropDownFields,
        ...event,
        value: selectedProjectList,
      })
    );
  };

  const getGraph = () => {
    const fetchData = async () => {
      try {
        const selectedProjectId: number[] = [];

        selectedProjectList.map((item) => {
          selectedProjectId.push(item.id);
        });

        console.log( urlPrefix.IP_port + "/insight/" + (selectedInsightIndexInList + 1),
        { params:{
          project_ids: selectedProjectId
        }}
      );
        const response = await axios.get(
          urlPrefix.IP_port + "/insight/" + (selectedInsightIndexInList + 1),
          { params:{
            project_ids: [4,5,6]
          }}
        );
        const data = JSON.parse(response.data);

        console.log(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
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

      <MultiSelectTree
        style={{ width: "20%", margin: "10px" }}
        data={constructionCompanyList}
        value={selectedConstructionCompanyList}
        onChange={onNewConstructionCompanySelection}
        textField="constructionCompany"
        dataItemKey="id"
        checkField={checkField}
        checkIndeterminateField={checkIndeterminateField}
        expandField={expandField}
      />

      <MultiSelectTree
        style={{ width: "20%", margin: "10px" }}
        data={filteredProjectList}
        value={selectedProjectList}
        onChange={onNewProjectSelection}
        textField="projectName"
        dataItemKey="id"
        checkField={checkField}
        checkIndeterminateField={checkIndeterminateField}
        expandField={expandField}
        tags={
          selectedProjectList.length > 0
            ? [
                {
                  text: `${selectedProjectList.length} projects selected`,
                  data: [...selectedProjectList],
                },
              ]
            : []
        }
      />
      <Button onClick={getGraph}>Search</Button>
    </div>
  );
};

export default InsightList;
