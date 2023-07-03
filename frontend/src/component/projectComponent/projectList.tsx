import React, { useEffect, useState } from "react";
import {
  DropDownList,
  DropDownListFilterChangeEvent,
  ComboBox,
} from "@progress/kendo-react-dropdowns";
import {
  RangeSlider,
  SliderLabel,
  TextBox,
} from "@progress/kendo-react-inputs";
import { Button } from "@progress/kendo-react-buttons";
import {
  CompositeFilterDescriptor,
  filterBy,
  FilterDescriptor,
} from "@progress/kendo-data-query";
import axios from "axios";
import urlPrefix from "../../resource/URL_prefix.json";
import { projectList_interface } from "./../../interface/projectList_interface";
import { project_interface } from "./../../interface/project_interface";
import "./../../styles/ProjectList.scss";

//{ field: "construction_company", operator: "eq", value: "" }
const ProjectList = (props: any) => {
  const [data, setData] = useState<project_interface[]>([]);

  const [projectList, setProjectList] = useState<string[]>([]);
  const [selectedProjectName, setSelectedProjectName] =
    useState<string>("project를 선택해주세요");

  const [projectFilter, setProjectFilter] = useState<CompositeFilterDescriptor>(
    {
      logic: "and",
      filters: [],
    }
  );
  const [fileteredList, setFileteredList] = useState<string[]>([]);
  const [filteredData, setFilteredData] = useState<project_interface[]>([]);


  //[0,10000][0,200000]이 아니라 들어오는 값들 따라서 최대값으로 설정해야함
  const [buildingAreaSliderValues, setBuildingAreaSliderValues] = useState<
    number[]
  >([]);
  const [buildingAreaMinMax, setBuildingAreaMinMax] = useState<number[]>([
    0, 2500,
  ]);

  const [totalAreaSliderValues, setTotalAreaSliderValues] = useState<number[]>(
    []
  );
  const [totalAreaMinMax, setTotalAreaMinMax] = useState<number[]>([0, 200000]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          urlPrefix.IP_port + "/dashboard/project/"
        );
        const data = JSON.parse(response.data);

        const projectNames = data.map(
          (obj: projectList_interface) => obj.project_name
        );

        setData(data); //projectList의 project data
        setFilteredData(data);
        props.setData(data); //projects 페이지의 project data
        setProjectList(projectNames);
        setFileteredList(projectNames);

      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setBuildingAreaSliderValue();
    setTotalAreaSliderValue();
  }, [data]);

  useEffect(() => {
    const projectNames = filteredData.map(
      (obj: projectList_interface) => obj.project_name
    );
    setFileteredList(projectNames);
  }, [filteredData]);

  const filterData = (filter: FilterDescriptor | CompositeFilterDescriptor) => {
    const data = projectList.slice();
    return filterBy(data, filter);
  };

  const filterChange = (event: any) => {
    setFileteredList(filterData(event.filter));
  };

  const projectListOnChange = (event: any) => {
    setSelectedProjectName(event.target.value);
    props.setSelectedProjectName(event.target.value);
  };

  const applyFilter = () => {
    projectFilter.filters = projectFilter.filters.filter((filter) => {
      return !("field" in filter && filter.field === "building_area");
    });
    projectFilter.filters.push(
      {
        field: "building_area",
        operator: "gte",
        value: buildingAreaMinMax[0],
      },
      {
        field: "building_area",
        operator: "lt",
        value: buildingAreaMinMax[1],
      }
    );

    projectFilter.filters = projectFilter.filters.filter((filter) => {
      return !("field" in filter && filter.field === "total_area");
    });
    projectFilter.filters.push(
      {
        field: "total_area",
        operator: "gte",
        value: totalAreaMinMax[0],
      },
      {
        field: "total_area",
        operator: "lt",
        value: totalAreaMinMax[1],
      }
    );

    setFilteredData(filterBy(data, projectFilter));
  };

  const constructionCompanyOnChange = (event: any) => {
    projectFilter.filters = projectFilter.filters.filter((filter) => {
      return !("field" in filter && filter.field === "construction_company");
    });

    projectFilter.filters.push({
      field: "construction_company",
      operator: "eq",
      value: event.target.value,
    });
  };
  const locationOnChange = (event: any) => {
    projectFilter.filters = projectFilter.filters.filter((filter) => {
      // Remove filters where the field is "construction_company"
      return !("field" in filter && filter.field === "location");
    });

    projectFilter.filters.push({
      field: "location",
      operator: "eq",
      value: event.target.value,
    });
  };

  const setBuildingAreaSliderValue = () => {
    let largestBuildingArea_temp = -1;
    for (const project of data) {
      if (project.building_area > largestBuildingArea_temp) {
        largestBuildingArea_temp = project.building_area;
      }
    }

    let sliderValues = [];
    largestBuildingArea_temp =
      largestBuildingArea_temp - (largestBuildingArea_temp % 2500);
    sliderValues.push(largestBuildingArea_temp + 2500);
    while (largestBuildingArea_temp >= 0) {
      sliderValues.push(largestBuildingArea_temp);
      largestBuildingArea_temp -= 2500;
    }
    setBuildingAreaSliderValues(sliderValues);

    //////setBuildingAreaMinMax([0,sliderValues[0]]);
  };
  const setTotalAreaSliderValue = () => {
    let largestTotalArea_temp = -1;
    for (const project of data) {
      if (project.total_area > largestTotalArea_temp) {
        largestTotalArea_temp = project.total_area;
      }
    }

    let sliderValues = [];
    largestTotalArea_temp =
      largestTotalArea_temp - (largestTotalArea_temp % 50000);
    sliderValues.push(largestTotalArea_temp + 50000);
    while (largestTotalArea_temp >= 0) {
      sliderValues.push(largestTotalArea_temp);
      largestTotalArea_temp -= 50000;
    }
    setTotalAreaSliderValues(sliderValues);
  };

  const buildingAreaSliderOnClick = (event: any) => {
    setBuildingAreaMinMax([
      parseFloat(event.value.start.toFixed(4)),
      parseFloat(event.value.end.toFixed(4)),
    ]);
  };
  const handleBuildingAreaMinTextChange = (event: any) => {
    setBuildingAreaMinMax([event.target.value, buildingAreaMinMax[1]]);
  };
  const handleBuildingAreaMaxTextChange = (event: any) => {
    setBuildingAreaMinMax([buildingAreaMinMax[0], event.target.value]);
  };

  const totalAreaSliderOnClick = (event: any) => {
    setTotalAreaMinMax([
      parseFloat(event.value.start.toFixed(4)),
      parseFloat(event.value.end.toFixed(4)),
    ]);
  };
  const handleTotalAreaMinTextChange = (event: any) => {
    setTotalAreaMinMax([event.target.value, totalAreaMinMax[1]]);
  };
  const handleTotalAreaMaxTextChange = (event: any) => {
    setTotalAreaMinMax([totalAreaMinMax[0], event.target.value]);
  };

  return (
    <div className="project-list-container">
      <ComboBox
        data={fileteredList}
        value={selectedProjectName}
        onChange={projectListOnChange}
        onFilterChange={filterChange}
        filterable={true}
        className="project-combobox"
      />
      <div className="filter-group">
        <DropDownList
          onChange={constructionCompanyOnChange}
          data={data
            .map((item) => item.construction_company)
            .filter((value, index, array) => array.indexOf(value) === index)}
          className="filter-dropdown"
        />

        <RangeSlider
          defaultValue={{
            start: buildingAreaMinMax[0],
            end: buildingAreaMinMax[1],
          }}
          step={1}
          min={0}
          max={buildingAreaSliderValues[0]}
          onChange={buildingAreaSliderOnClick}
          className="range-slider"
        >
          {buildingAreaSliderValues.map((perc, i) => (
            <SliderLabel key={i} position={perc}>
              {perc.toString()}
            </SliderLabel>
          ))}
        </RangeSlider>

        <TextBox
          value={buildingAreaMinMax[0]}
          onChange={handleBuildingAreaMinTextChange}
          contentEditable={true}
          rounded={"large"}
          className="slider-textbox"
        ></TextBox>
        <TextBox
          value={buildingAreaMinMax[1]}
          onChange={handleBuildingAreaMaxTextChange}
          contentEditable={true}
          rounded={"large"}
          className="slider-textbox"
        ></TextBox>
      </div>

      <div className="filter-group">
        <DropDownList
          onChange={locationOnChange}
          data={data
            .map((item) => item.location)
            .filter((value, index, array) => array.indexOf(value) === index)}
          className="filter-dropdown"
        />

        <RangeSlider
          defaultValue={{
            start: totalAreaMinMax[0],
            end: totalAreaMinMax[1],
          }}
          step={1}
          min={0}
          max={totalAreaSliderValues[0]}
          onChange={totalAreaSliderOnClick}
          className="range-slider"
        >
          {totalAreaSliderValues.map((perc, i) => (
            <SliderLabel key={i} position={perc}>
              {perc.toString()}
            </SliderLabel>
          ))}
        </RangeSlider>

        <TextBox
          value={totalAreaMinMax[0]}
          onChange={handleTotalAreaMinTextChange}
          contentEditable={true}
          rounded={"large"}
          className="slider-textbox"
        ></TextBox>
        <TextBox
          value={totalAreaMinMax[1]}
          onChange={handleTotalAreaMaxTextChange}
          contentEditable={true}
          rounded={"large"}
          className="slider-textbox"
        ></TextBox>
      </div>

      <Button onClick={applyFilter} className="apply-filter-button">
        apply filters
      </Button>
    </div>
  );
};

export default ProjectList;
