import React, { useEffect, useState } from "react";
import { ComboBox } from "@progress/kendo-react-dropdowns";
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

import { ProjectIdName } from "interface/ProjectInterface";
import { ProjectInfo } from "interface/ProjectInterface";

//context
import { useProjectName, useBuildingInfo } from "App";

import { getDetailedProjectData } from "services/project/projectService";

import "styles/ProjectList.scss";
import loadingBars from "resource/loadingBars.gif";

const ProjectList = (props: {
  setData: React.Dispatch<React.SetStateAction<ProjectIdName[]>>;
}) => {
  const [data, setData] = useState<ProjectInfo[]>([]);

  const [projectList, setProjectList] = useState<string[]>([]);

  const [projectName, setProjectName] = useProjectName();

  const [fileteredList, setFileteredList] = useState<string[]>([]);
  const [filteredData, setFilteredData] = useState<ProjectInfo[]>([]);
  const [projectFilter, setProjectFilter] = useState<CompositeFilterDescriptor>(
    {
      logic: "and",
      filters: [],
    }
  );

  const [
    constructionCompanyFilterSelected,
    setConstructionCompanyFilterSelected,
  ] = useState<string>("전체");
  const [totalAreaFilterSelected, setTotalAreaFilterSelected] =
    useState<string>("전체");

  //[0,10000][0,200000]이 아니라 들어오는 값들 따라서 최대값으로 설정해야함
  const [buildingAreaSliderValues, setBuildingAreaSliderValues] = useState<
    number[]
  >([]);
  const [buildingAreaMinMax, setBuildingAreaMinMax] = useState<number[]>([
    0, 0,
  ]);
  const [totalAreaSliderValues, setTotalAreaSliderValues] = useState<number[]>(
    []
  );
  const [totalAreaMinMax, setTotalAreaMinMax] = useState<number[]>([0, 0]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    getDetailedProjectData().then((data) => {
      const projectNames = data.map((obj: ProjectIdName) => obj.project_name);

      setData(data); //projectList의 project data
      setFilteredData(data);
      props.setData(data); //projects 페이지의 project data
      setProjectList(projectNames);
      setFileteredList(projectNames);
    });
  }, []);

  useEffect(() => {
    setBuildingAreaSliderValue();
    setTotalAreaSliderValue();
  }, [data]);

  useEffect(() => {
    const projectNames = filteredData.map(
      (obj: ProjectIdName) => obj.project_name
    );
    setFileteredList(projectNames);
  }, [filteredData]);

  useEffect(() => {
    applyFilter();
  }, [projectFilter]);

  //projectList operations
  const filterData = (filter: FilterDescriptor | CompositeFilterDescriptor) => {
    const data = projectList.slice();
    return filterBy(data, filter);
  };
  const filterChange = (event: any) => {
    setFileteredList(filterData(event.filter));
  };
  const projectListOnChange = (event: any) => {
    setProjectName(event.target.value);
  };

  //건설회사,지역 comboboxes
  const constructionCompanyOnChange = (event: any) => {
    //change selected value of the dropdown
    setConstructionCompanyFilterSelected(event.target.value);

    // Remove filters where the field is "construction_company"
    projectFilter.filters = projectFilter.filters.filter((filter) => {
      return !("field" in filter && filter.field === "construction_company");
    });

    if (event.target.value === "전체") return;
    // and add new filter
    projectFilter.filters.push({
      field: "construction_company",
      operator: "eq",
      value: event.target.value,
    });
  };
  const locationOnChange = (event: any) => {
    //change selected value of the dropdown
    setTotalAreaFilterSelected(event.target.value);

    projectFilter.filters = projectFilter.filters.filter((filter) => {
      return !("field" in filter && filter.field === "location");
    });

    if (event.target.value === "전체") return;
    projectFilter.filters.push({
      field: "location",
      operator: "eq",
      value: event.target.value,
    });
  };

  //apply,reset
  const applyFilter = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);

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

  const resetFilter = async () => {
    setBuildingAreaMinMax([0, buildingAreaSliderValues[0]]);
    setTotalAreaMinMax([0, totalAreaSliderValues[0]]);

    setConstructionCompanyFilterSelected("전체");
    setTotalAreaFilterSelected("전체");

    setProjectFilter({
      logic: "and",
      filters: [],
    });
  };

  //Sliders
  /**
   * 만약 building_area의 가장 큰값이 11000이라면
   * 12500 10000 7500...
   */
  const setBuildingAreaSliderValue = () => {
    let largestBuildingArea_temp = -1;
    for (const project of data) {
      if (project.building_area > largestBuildingArea_temp) {
        largestBuildingArea_temp = project.building_area;
      }
    }
    largestBuildingArea_temp = 7000;
    let sliderValues = [];
    largestBuildingArea_temp =
      largestBuildingArea_temp - (largestBuildingArea_temp % 2500);
    sliderValues.push(largestBuildingArea_temp + 2500);
    while (largestBuildingArea_temp >= 0) {
      sliderValues.push(largestBuildingArea_temp);
      largestBuildingArea_temp -= 2500;
    }
    setBuildingAreaSliderValues(sliderValues);
    setBuildingAreaMinMax([0, sliderValues[0]]);
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
    setTotalAreaMinMax([0, sliderValues[0]]);
  };

  const buildingAreaSliderOnClick = (event: any) => {
    setBuildingAreaMinMax([
      parseFloat(parseFloat(event.value.start).toFixed(2)),
      parseFloat(parseFloat(event.value.end).toFixed(2)),
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
      parseFloat(parseFloat(event.value.start).toFixed(2)),
      parseFloat(parseFloat(event.value.end).toFixed(2)),
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
      <div className="combo-box-container">
        <label htmlFor="project-combobox" className="custom-label-project">
          프로젝트명:
        </label>
        <ComboBox
          id="project-combobox"
          data={fileteredList}
          value={projectName}
          onChange={projectListOnChange}
          onFilterChange={filterChange}
          filterable={true}
          className="project-combobox"
          style={{ marginBottom: "10px" }}
        />
      </div>

      <div className="filter-group">
        <div
          className="list-container"
          style={{ justifyContent: "flex-start" }}
        >
          <div style={{ width: "25%", display: "flex" }}>
            <label
              htmlFor="construction-company-dropdown"
              className="custom-label"
            >
              건설회사:
            </label>
            <ComboBox
              id="construction-company-dropdown"
              onChange={constructionCompanyOnChange}
              value={constructionCompanyFilterSelected}
              data={["전체"].concat(
                data
                  .map((item) => item.construction_company)
                  .filter(
                    (value, index, array) => array.indexOf(value) === index
                  )
              )}
            />
          </div>
          <div style={{ width: "25%", display: "flex" }}>
            <label htmlFor="location-dropdown" className="custom-label">
              지역:
            </label>
            <ComboBox
              id="location-dropdown"
              onChange={locationOnChange}
              value={totalAreaFilterSelected}
              data={["전체"].concat(
                data
                  .map((item) => item.location)
                  .filter(
                    (value, index, array) => array.indexOf(value) === index
                  )
              )}
            />
          </div>
        </div>
        <div className="slider-group" style={{ marginLeft: "-2%" }}>
          <div className="left-slider" style={{ width: "50%" }}>
            <div className="form-field" style={{ width: "100%" }}>
              <label
                htmlFor="building-area-range-slider"
                className="custom-label"
                // style={{ marginLeft: "-100% !important" }}
              >
                빌딩면적:
              </label>
              <RangeSlider
                id="building-area-range-slider"
                value={{
                  start: buildingAreaMinMax[0],
                  end: buildingAreaMinMax[1],
                }}
                step={1}
                min={0}
                max={buildingAreaSliderValues[0]}
                onChange={buildingAreaSliderOnClick}
                className="range-slider"
                style={{ width: "23vw" }}
              >
                {buildingAreaSliderValues.map((perc, i) => (
                  <SliderLabel key={i} position={perc}>
                    {perc.toString()}
                  </SliderLabel>
                ))}
              </RangeSlider>
            </div>

            <div className="form-field">
              <label
                htmlFor="building-area-min-textbox"
                className="custom-label"
              >
                범위:
              </label>
              <TextBox
                id="building-area-min-textbox"
                value={buildingAreaMinMax[0]}
                onChange={handleBuildingAreaMinTextChange}
                contentEditable={true}
                rounded={"large"}
                className="slider-textbox"
                style={{ marginRight: "1%" }}
              ></TextBox>
              <label
                htmlFor="building-area-max-textbox"
                className="custom-label-range"
              >
                ~
              </label>
              <TextBox
                id="building-area-max-textbox"
                value={buildingAreaMinMax[1]}
                onChange={handleBuildingAreaMaxTextChange}
                contentEditable={true}
                rounded={"large"}
                className="slider-textbox"
              ></TextBox>
            </div>
          </div>

          <div className="right-slider" style={{ width: "50%" }}>
            <div className="form-field" style={{ width: "100%" }}>
              <label htmlFor="total-area-range-slider" className="custom-label">
                연면적:
              </label>
              <RangeSlider
                id="total-area-range-slider"
                value={{
                  start: totalAreaMinMax[0],
                  end: totalAreaMinMax[1],
                }}
                step={1}
                min={0}
                max={totalAreaSliderValues[0]}
                onChange={totalAreaSliderOnClick}
                className="range-slider"
                style={{ width: "23vw" }}
              >
                {totalAreaSliderValues.map((perc, i) => (
                  <SliderLabel key={i} position={perc}>
                    {perc.toString()}
                  </SliderLabel>
                ))}
              </RangeSlider>
            </div>

            <div className="form-field">
              <label htmlFor="total-area-min-textbox" className="custom-label">
                범위:
              </label>
              <TextBox
                id="total-area-min-textbox"
                value={totalAreaMinMax[0]}
                onChange={handleTotalAreaMinTextChange}
                contentEditable={true}
                rounded={"large"}
                className="slider-textbox"
                style={{ marginRight: "1%" }}
              ></TextBox>
              <label
                htmlFor="total-area-max-textbox"
                className="custom-label-range"
              >
                ~
              </label>
              <TextBox
                id="total-area-max-textbox"
                value={totalAreaMinMax[1]}
                onChange={handleTotalAreaMaxTextChange}
                contentEditable={true}
                rounded={"large"}
                className="slider-textbox"
              ></TextBox>
            </div>
          </div>
        </div>

        <div className="button-container">
          <Button
            onClick={resetFilter}
            className="reset-filter-button"
            style={{
              backgroundColor: "rgb(25, 101, 203)",
              color: "white",
              fontSize: "80%",
            }}
          >
            Reset filters
          </Button>
          <Button
            onClick={applyFilter}
            className="apply-filter-button"
            style={{
              backgroundColor: "rgb(25, 101, 203)",
              color: "white",
              fontSize: "80%",
            }}
          >
            Apply filters
          </Button>
          {isLoading ? (
            <img
              alt="loader"
              src={loadingBars}
              style={{
                width: "2%",
                height: "2%",
                marginLeft: "1%",
                marginRight: "1%",
              }}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ProjectList;
