import React, {
  useState,
  useEffect,
  SetStateAction,
  JSXElementConstructor,
} from "react";
import {
  Grid,
  GridColumn,
  getSelectedState,
  getSelectedStateFromKeyDown,
  GridFilterChangeEvent,
} from "@progress/kendo-react-grid";
import {
  filterBy,
  CompositeFilterDescriptor,
} from "@progress/kendo-data-query";
import axios from "axios";
import { building } from "../../interface/building";
import { MultiSelectPropsContext } from "@progress/kendo-react-dropdowns";
import BuildingDetail from "./buildingDetail";
import ProjectIntro from "../homeComponent/totalProjectNum";
import urlPrefix from "../../resource/URL_prefix.json";

const DATA_ITEM_KEY = "id";
const SELECTED_FIELD = "selected";
const initialDataState = {
  skip: 0,
  take: 15,
};

//여기에 빌딩상세정보
const DetailComponent = (props: any) => {
  props.setBuildingInfo(props.dataItem);
  return (
    <div>
      <BuildingDetail projectName = {props.projectName} buildingInfo={props.dataItem} />
    </div>
  );
};

const initialFilter: CompositeFilterDescriptor = {
  //filter 여러개가 적용될때 and, or?
  logic: "and",
  filters: [{ field: "project_id", operator: "eq", value: "0" }],
};

const BuildingList = (props: any) => {
  const [initialBuildingList, setInitialBuildingList] = useState<building[]>(
    []
  );
  const [buildingList, setBuildingList] = useState<building[]>([]);
  const [page, setPage] = React.useState(initialDataState);
  const [pageSizeValue, setPageSizeValue] = React.useState();

  const [categories, setCategories] = React.useState([]);
  //const [attributeNames, setAttributeNames] = useState<string[]>([""]);
  const [projectFilter, setProjectFilter] = useState(initialFilter);

  useEffect(() => {
    if (props.projectList) {
      const projectId: number = props.projectList.find(
        (item: any) => item.project_name === props.projectName
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
  }, [props.projectList, props.projectName]);

  useEffect(() => {
    const filteredItems = filterBy(initialBuildingList, projectFilter);
    setBuildingList(filteredItems);
  }, [initialBuildingList, projectFilter]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          urlPrefix.IP_port + "/building/additional_sub_info"
        );
        const data = JSON.parse(response.data);

        setBuildingList(data);
        setInitialBuildingList(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
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
        style={{ height: "60vh", width: "100%" }}
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
        detail={({ dataItem }) => (
          <DetailComponent
            dataItem={dataItem}
            setBuildingInfo={props.setBuildingInfo}
          />
        )}
        onExpandChange={expandChange}
        filter={projectFilter}
        onFilterChange={(e: GridFilterChangeEvent) => {}}
      >
        <GridColumn
          title="Building Name"
          field="building_name"
          headerClassName={headerClassName}
        />
        <GridColumn
          title="Total Area"
          field="total_area"
          headerClassName={headerClassName}
        />
        <GridColumn
          title="Stories"
          field="stories"
          headerClassName={headerClassName}
        />
        <GridColumn
          title="Sub Buildings"
          field="sub_bldg_list"
          headerClassName={headerClassName}
        />
      </Grid>
    </div>
  );
};

export default BuildingList;
