import React, { useState, useEffect } from "react";
import {
  Grid,
  GridColumn,
  GridFilterChangeEvent,
} from "@progress/kendo-react-grid";
import {
  filterBy,
  CompositeFilterDescriptor,
} from "@progress/kendo-data-query";
import { Building } from "interface/BuildingInterface";
import BuildingDetail from "component/project/BuildingDetail";

import { getDetailedBuildingList } from "services/building/buildingService";

import "styles/GridDetail.scss";

import { useProjectName, useBuildingInfo } from "App";
import { ProjectIdName } from "interface/ProjectInterface";

const DATA_ITEM_KEY = "id";
const initialDataState = {
  skip: 0,
  take: 15,
};

//여기에 빌딩상세정보
const DetailComponent = (props: any) => {
  const [buildingInfo, setBuildingInfo] = useBuildingInfo();
  setBuildingInfo(props.dataItem);
  return (
    <div>
      <BuildingDetail forAnalysisTab={false} />
    </div>
  );
};

const initialFilter: CompositeFilterDescriptor = {
  //filter 여러개가 적용될때 and, or?
  logic: "and",
  filters: [{ field: "project_id", operator: "eq", value: "0" }],
};

const BuildingList = (props: { projectList: ProjectIdName[] }) => {
  const [initialBuildingList, setInitialBuildingList] = useState<Building[]>(
    []
  );
  const [buildingList, setBuildingList] = useState<Building[]>([]);
  const [page, setPage] = React.useState(initialDataState);
  const [pageSizeValue, setPageSizeValue] = React.useState();

  const [categories, setCategories] = React.useState([]);
  const [projectFilter, setProjectFilter] = useState(initialFilter);

  const [projectName, setProjectName] = useProjectName();

  useEffect(() => {
    if (props.projectList) {
      const projectId: number | undefined = props.projectList.find(
        (item: any) => item.project_name === projectName
      )?.id;
      if (projectId) {
        setProjectFilter({
          logic: "and",
          filters: [
            {
              field: "project_id",
              operator: "eq",
              value: projectId.toString(),
            },
          ],
        });
        setPage(initialDataState);
      }
    }
  }, [props.projectList, projectName]);

  useEffect(() => {
    const filteredItems = filterBy(initialBuildingList, projectFilter);
    setBuildingList(filteredItems);
  }, [initialBuildingList, projectFilter]);

  useEffect(() => {
    getDetailedBuildingList().then((detailedBuildingList) => {
      setBuildingList(detailedBuildingList);
      setInitialBuildingList(detailedBuildingList);
    });
  }, []);

  const pageChange = (event: any) => {
    const targetEvent = event.targetEvent;
    const take = targetEvent.value === "All" ? 77 : event.page.take;
    if (targetEvent.value) {
      setPageSizeValue(targetEvent.value);
    }
    setPage({
      ...event.page,
      take,
    });
  };
  const expandChange = (event: any) => {
    event.dataItem.expanded = event.value;
    setCategories([...categories]);
    if (!event.value || event.dataItem.details) {
      return;
    }
  };

  const headerClassName = "custom-header-cell";

  return (
    <div className="building-list-container">
      <Grid
        style={{ height: "60vh", width: "97.5%" }}
        data={buildingList.slice(page.skip, page.take + page.skip)}
        skip={page.skip}
        take={page.take}
        total={buildingList.length}
        dataItemKey={DATA_ITEM_KEY}
        pageable={{
          buttonCount: 10,
          pageSizes: [10, 15, 20, "All"],
          pageSizeValue: pageSizeValue,
        }}
        onPageChange={pageChange}
        expandField="expanded"
        detail={({ dataItem }) => <DetailComponent dataItem={dataItem} />}
        onExpandChange={expandChange}
        filter={projectFilter}
        onFilterChange={(e: GridFilterChangeEvent) => {}}
      >
        <GridColumn
          title="빌딩명"
          field="building_name"
          headerClassName={headerClassName}
          className="custom-text-cell"
        />
        <GridColumn
          title="빌딩별 전체 면적(㎡)"
          field="total_area_square_meter"
          headerClassName={headerClassName}
          className="custom-number-cell"
          format={"{0:n2}"}
        />
        <GridColumn
          title="빌딩 전체 층수(층)"
          field="total_stories"
          headerClassName={headerClassName}
          className="custom-number-cell"
        />
        <GridColumn
          title="Sub Buildings"
          field="sub_bldg_list"
          headerClassName={headerClassName}
          className="custom-text-cell"
        />
      </Grid>
    </div>
  );
};

export default BuildingList;
