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
    "건설사의 프로젝트들에 대해, 프로젝트별 빌딩의 콘크리트 ㎥당 철근량(ton) 값에 대한 분석",
    "건설사의 프로젝트들에 대해, 프로젝트별 빌딩의 콘크리트 ㎥당 철근량(ton) 값의 분포 분석 (BoxPlot)",
    "건설사의 프로젝트들에 대해, 프로젝트별 빌딩의 콘크리트 종류별 사용비율 비교",
    "건설사들에 대한 콘크리트당 철근중량 비교",
    "건설사의 한 프로젝트에서 내력벽의 그루핑에 따른 콘크리트당 철근값의 비교",
    "건설사의 한 프로젝트에 대해서 층별, 부재타입별로 철근 타입별로 콘크리트당 철근사용량의 값을 한눈에 보여주는 히트맵 분석",
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
  const [projectFilter, setProjectFilter] = useState<CompositeFilterDescriptor>(
    {
      logic: "or",
      filters: [],
    }
  );

  const [buildingList, setBuildingList] = useState<
    {
      buildingName: string;
      id: number;
      checked: boolean;
    }[]
  >([]);
  const [filteredBuildingList, setFilteredBuildingList] = useState<
    {
      buildingName: string;
      id: number;
      checked: boolean;
    }[]
  >([]);
  const [selectedBuildingList, setSelectedBuildingList] = useState<
    {
      buildingName: string;
      id: number;
      checked: boolean;
    }[]
  >([]);
  const [buildingFilter, setBuildingFilter] =
    useState<CompositeFilterDescriptor>({
      logic: "or",
      filters: [],
    });

  const [isAnalyzable, setIsAnalyzable] = useState<boolean>(false);
  const [analyzeNotice, setAnalyzeNotice]= useState<string>("시나리오를 선택해주세요");


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
    setFilteredBuildingList(buildingList);
  }, [buildingList]);
  useEffect(() => {
    setFilteredBuildingList(filterBy(buildingList, buildingFilter));
  }, [buildingFilter]);


  //initialize lower filters when upper filter changes
  useEffect(()=>{
    setSelectedConstructionCompanyList([]);
    setSelectedProjectList([]);
    setSelectedBuildingList([]);
  }, [selectedInsightIndexInList])
  useEffect(()=>{
    setSelectedProjectList([]);
    setSelectedBuildingList([]);
  }, [selectedConstructionCompanyList])
   useEffect(()=>{
    setSelectedBuildingList([]);
  }, [selectedProjectList])

  
  //update checkbox of projectList
  useEffect(() => {
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

    if (
      selectedInsightIndexInList + 1 === 6 &&
      selectedProjectList.length === 1
    ) {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            urlPrefix.IP_port +
              "/project/" +
              selectedProjectList[0].id +
              "/building_detail"
          );
          const data = JSON.parse(response.data);

          setBuildingList(
            [{ buildingName: "All", id: 0, checked: false }].concat(
              data.map((item: any) => {
                return {
                  buildingName: item.building_name,
                  id: item.id,
                  checked: false,
                };
              })
            )
          );
        } catch (error) {
          console.error(error);
        }
      };

      fetchData();
    }
  }, [selectedProjectList]);

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

  useEffect(() => {
    const updatedFilteredBuildingList = filteredBuildingList.map((item) => {
      const matchingItem = selectedBuildingList.find(
        (selectedItem) => selectedItem.id === item.id
      );

      if (matchingItem) {
        return { ...item, checked: true };
      } else return { ...item, checked: false };
    });

    if (filteredBuildingList.length === selectedBuildingList.length + 1) {
      updatedFilteredBuildingList[0].checked =
        !updatedFilteredBuildingList[0].checked;
      setFilteredBuildingList(updatedFilteredBuildingList);
    } else setFilteredBuildingList(updatedFilteredBuildingList);
  }, [selectedBuildingList]);

  const onSelectedInsightChange = (e: any) => {
    setSelectedInsightIndexInList(e.target.index);
    setSelectedInsightInList(e.value);
  };

  // 여기에서는 selected list만 set
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
  const onNewBuildingSelection = (event: MultiSelectTreeChangeEvent) => {
    if (event.items[0] === undefined) {
      setSelectedBuildingList(
        getMultiSelectTreeValue(buildingList, {
          ...selectDropDownFields,
          ...event,
          value: [],
        })
      );
    } else if (event.items[0].buildingName === "All") {
      if (event.items[0].checked) {
        setSelectedBuildingList([]);
      } else {
        setSelectedBuildingList(
          getMultiSelectTreeValue(buildingList, {
            ...selectDropDownFields,
            ...event,
            value: filteredBuildingList,
          }).map((item) => ({ ...item, checked: true }))
        );
      }
    } else {
      setSelectedBuildingList(
        getMultiSelectTreeValue(buildingList, {
          ...selectDropDownFields,
          ...event,
          value: selectedBuildingList,
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
        let paramName;
        let paramContent;
        if (selectedInsightIndexInList + 1 === 4) {
          const selectedCompanyName = selectedConstructionCompanyList.map(
            (item) => item.constructionCompany
          );

          paramName = "company_name_str";
          paramContent = JSON.stringify(selectedCompanyName);
        } else if (selectedInsightIndexInList + 1 === 5) {
          const selectedProjectId = selectedProjectList.map((item) => item.id);

          paramName = "project_id_str";
          paramContent = JSON.stringify(selectedProjectId);
        } else if (selectedInsightIndexInList + 1 === 6) {
          const selectedProjectId = selectedProjectList[0].id;
          const selectedBuildingId = selectedBuildingList.map(
            (item) => item.id
          );

          paramName = "project_building_ids_str";
          paramContent = JSON.stringify(
            selectedBuildingId.concat(selectedProjectId)
          );
        } else {
          const selectedProjectId = selectedProjectList.map((item) => item.id);

          paramName = "project_ids_str";
          paramContent = JSON.stringify(selectedProjectId);
        }

        params.append(paramName, paramContent);
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

  useEffect(() => {
    setIsAnalyzable(calculateAnalyzableCondition());
  }, [
    selectedInsightIndexInList,
    selectedConstructionCompanyList,
    selectedProjectList,
    selectedBuildingList,
  ]);

  const calculateAnalyzableCondition = () => {
    let analyzable = false;
    switch (selectedInsightIndexInList + 1) {
      case 1:
      case 2:
      case 3:
        if (selectedProjectList.length >= 1) analyzable = true;
        else analyzable = false;

        break;
      case 4:
        if (selectedConstructionCompanyList.length >= 1) analyzable = true;
        else analyzable = false;

        break;
      case 5:
        if (selectedProjectList.length === 1) analyzable = true;
        else analyzable = false;

        break;
      case 6:
        if (
          selectedBuildingList.length === 1 &&
          selectedProjectList.length === 1
        )
          analyzable = true;
        else analyzable = false;
        break;
    }
    return analyzable;
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

      <MultiSelectTree
        style={{ width: "20%", margin: "10px" }}
        data={filteredBuildingList}
        value={selectedBuildingList}
        onChange={onNewBuildingSelection}
        textField="buildingName"
        dataItemKey="id"
        checkField="checked"
        checkIndeterminateField={checkIndeterminateField}
        disabled={
          !(
            selectedInsightIndexInList + 1 === 6 &&
            selectedProjectList.length === 1
          )
        }
        expandField={expandField}
        tags={
          selectedBuildingList.length > 0
            ? [
                {
                  text: `${selectedBuildingList.length} buildings selected`,
                  data: [...selectedBuildingList],
                },
              ]
            : []
        }
      />
      <Button onClick={getGraph} disabled={!isAnalyzable}>
        Analyze
      </Button>
    </div>
  );
};

export default InsightList;
