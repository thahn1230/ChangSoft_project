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
const subItemsField = "items";
// const projectsTextField = "projectName";
// const constructionCompanyTextField = "constructionCompany";

const selectDropDownFields = {
  dataItemKey,
  checkField,
  checkIndeterminateField,
  expandField,
  subItemsField,
};

const InsightList = (props: any) => {
  const [insightList, setInsightList] = useState<string[]>([
    "건설사(선택)의 프로젝트들(선택)에 대해, 프로젝트별 빌딩의 콘크리트 ㎥당 철근량(ton) 값에 대한 분석",
    "건설사(선택)의 프로젝트들(선택)에 대해, 프로젝트별 빌딩의 콘크리트 ㎥당 철근량(ton) 값의 분포 분석 (BoxPlot)",
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
    { constructionCompany: string; id: number; checked: boolean }[]
  >([]);
  const [selectedConstructionCompanyList, setSelectedConstructionCompanyList] =
    useState<{ constructionCompany: string; id: number; checked: boolean }[]>(
      []
    );

  const [projectList, setProjectList] = useState<
    {
      projectName: string;
      id: number;
      constructionCompany: string;
      checked: boolean;
    }[]
  >([]);
  const [filteredProjectList, setFilteredProjectList] = useState<
    {
      projectName: string;
      id: number;
      constructionCompany: string;
      checked: boolean;
    }[]
  >([]);
  const [selectedProjectList, setSelectedProjectList] = useState<
    {
      projectName: string;
      id: number;
      constructionCompany: string;
      checked: boolean;
    }[]
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
          [
            {
              projectName: "All",
              id: 0,
              constructionCompany: "All",
              checked: false,
            },
          ].concat(
            data.map((item: any) => {
              return {
                projectName: item.project_name,
                id: item.id,
                constructionCompany: item.construction_company,
                checked: false,
              };
            })
          )
        );

        const uniqueConstructionCompanies = Array.from(
          new Set(data.map((item: any) => item.construction_company))
        );
        setConstructionCompanyList(
          [{ constructionCompany: "All", id: 0, checked: false }].concat(
            uniqueConstructionCompanies.map((constructionCompany: any) => {
              const item = data.find(
                (item: any) => item.construction_company === constructionCompany
              );
              return { constructionCompany, id: item.id, checked: false };
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
  useEffect(() => {
    setFilteredProjectList(filterBy(projectList, projectFilter));
  }, [projectFilter]);

  useEffect(() => {
    // set filter here
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

    console.log(constructionCompanyList);
    //set checkboxes
    const updatedConstructionCompanyList = constructionCompanyList.map(
      (item) => {
        const matchingItem = selectedConstructionCompanyList.find(
          (selectedItem) => selectedItem.id === item.id
        );

        if (matchingItem) {
          return { ...item, checked: true };
        } else return { ...item, checked: false };
      }
    );

    if (
      constructionCompanyList.length ===
      selectedConstructionCompanyList.length + 1
    ) {
      updatedConstructionCompanyList[0].checked =
        !updatedConstructionCompanyList[0].checked;
      setConstructionCompanyList(updatedConstructionCompanyList);
    } else setConstructionCompanyList(updatedConstructionCompanyList);
  }, [selectedConstructionCompanyList]);

  //update checkbox of projectList
  useEffect(() => {
    console.log(selectedProjectList);
    const updatedFilteredProjectList = filteredProjectList.map((item) => {
      const matchingItem = selectedProjectList.find(
        (selectedItem) => selectedItem.id === item.id
      );

      if (matchingItem) {
        return { ...item, checked: true };
      } else return { ...item, checked: false };
    });

    if (filteredProjectList.length === selectedProjectList.length + 1) {
      updatedFilteredProjectList[0].checked =
        !updatedFilteredProjectList[0].checked;
      setFilteredProjectList(updatedFilteredProjectList);
    } else setFilteredProjectList(updatedFilteredProjectList);
  }, [selectedProjectList]);

  const onSelectedInsightChange = (e: any) => {
    setSelectedInsightIndexInList(e.target.index);
    setSelectedInsightInList(e.value);
  };

  // 여기에서는 선택된 건설회사만 set
  const onNewConstructionCompanySelection = (
    event: MultiSelectTreeChangeEvent
  ) => {
    if (event.items[0] === undefined) {
      setSelectedConstructionCompanyList(
        getMultiSelectTreeValue(constructionCompanyList, {
          ...selectDropDownFields,
          ...event,
          value: [],
        })
      );
    } else if (event.items[0].constructionCompany === "All") {
      if (event.items[0].checked) {
        setSelectedConstructionCompanyList([]);
      } else {
        setSelectedConstructionCompanyList(
          getMultiSelectTreeValue(constructionCompanyList, {
            ...selectDropDownFields,
            ...event,
            value: constructionCompanyList,
          }).map((item) => ({ ...item, checked: true }))
        );
      }
    } else {
      setSelectedConstructionCompanyList(
        getMultiSelectTreeValue(constructionCompanyList, {
          ...selectDropDownFields,
          ...event,
          value: selectedConstructionCompanyList,
        }).map((item) => ({ ...item, checked: true }))
      );
    }
  };
  //위에 construction도 똑같이 바꿔야됨
  const onNewProjectSelection = (event: MultiSelectTreeChangeEvent) => {
    if (event.items[0] === undefined) {
      setSelectedProjectList(
        getMultiSelectTreeValue(projectList, {
          ...selectDropDownFields,
          ...event,
          value: [],
        })
      );
    } else if (event.items[0].projectName === "All") {
      console.log(
        getMultiSelectTreeValue(projectList, {
          ...selectDropDownFields,
          ...event,
          value: [],
        }).map((item) => ({ ...item, checked: false }))
      );

      if (event.items[0].checked) {
        setSelectedProjectList([]);
      } else {
        setSelectedProjectList(
          getMultiSelectTreeValue(projectList, {
            ...selectDropDownFields,
            ...event,
            value: filteredProjectList,
          }).map((item) => ({ ...item, checked: true }))
        );
      }
    } else {
      setSelectedProjectList(
        getMultiSelectTreeValue(projectList, {
          ...selectDropDownFields,
          ...event,
          value: selectedProjectList,
        }).map((item) => ({ ...item, checked: true }))
      );
    }
  };

  // 이 형식으로 [계룡건설, 우미건설]
  const getGraph = () => {
    props.setIsLoading(true);
    props.setSelectedInsightIndex(selectedInsightIndexInList);
    setSelectedInsightIndex(selectedInsightIndexInList);

    const fetchData = async () => {
      try {
        const params = new URLSearchParams();

        if (selectedInsightIndexInList + 1 === 4) {
          const selectedCompanyName = selectedConstructionCompanyList.map(
            (item) => item.constructionCompany
          );
          params.append(
            "company_name_str",
            JSON.stringify(selectedCompanyName)
          );
        } else if (
          selectedInsightIndexInList + 1 === 5 ||
          selectedInsightIndexInList + 1 === 6
        ) {
          const selectedProjectId = selectedProjectList.map((item) => item.id);
          params.append("project_id_str", JSON.stringify(selectedProjectId));
        } else {
          const selectedProjectId = selectedProjectList.map((item) => item.id);
          params.append("project_ids_str", JSON.stringify(selectedProjectId));
        }
        //console.log(params.values)
        const response = await axios.get(
          `${urlPrefix.IP_port}/insight/${selectedInsightIndexInList + 1}`,
          { params }
        );
        const data = JSON.parse(response.data);
        props.setGraphInfo(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  };

  useEffect(() => {
    props.setIsLoading(false);
  }, [props.graphInfo]);

  return (
    <div>
      <label>Insight : </label>
      <DropDownList
        data={insightList}
        value={selectedInsightInList}
        onChange={onSelectedInsightChange}
        style={{ width: "30%", margin: "10px" }}
      />

      <MultiSelectTree
        style={{ width: "20%", margin: "10px" }}
        data={constructionCompanyList}
        value={selectedConstructionCompanyList}
        onChange={onNewConstructionCompanySelection}
        textField="constructionCompany"
        dataItemKey="id"
        checkField="checked"
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
        checkField="checked"
        checkIndeterminateField={checkIndeterminateField}
        disabled={
          selectedConstructionCompanyList.length === 0 ||
          selectedInsightIndexInList + 1 === 4
        }
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
      <Button onClick={getGraph}>Analyze</Button>
    </div>
  );
};

export default InsightList;
