import react, { useEffect, useState } from "react";
import {
  DropDownList,
  DropDownListChangeEvent,
  MultiSelect,
  MultiSelectChangeEvent,
  MultiSelectTree,
  MultiSelectTreeChangeEvent,
  MultiSelectTreeExpandEvent,
  getMultiSelectTreeValue,
} from "@progress/kendo-react-dropdowns";
import { Button } from "@progress/kendo-react-buttons";
import { subBuildingInfo_interface } from "../../../interface/subBuildingInfo_interface";
import urlPrefix from "../../../resource/URL_prefix.json";
import {
  CompositeFilterDescriptor,
  filterBy,
  FilterDescriptor,
} from "@progress/kendo-data-query";
import SingleColTable from "./SingleColTable";

const dataItemKey = "id";
const checkField = "checkField";
const checkIndeterminateField = "checkIndeterminateField";
const expandField = "expanded";
const subItemsField = "items";

const selectDropDownFields = {
  dataItemKey,
  checkField,
  checkIndeterminateField,
  expandField,
  subItemsField,
};

interface idNameI {
  id: number;
  name: string;
}
interface ConcreteDataI {
  id: number;
  object_id: number;
  floor_id: number;
  sub_building_id: number;
  component_type: string;
  section_name: string;
  construction_zone: string;
  category: string;
  component_id: number;
  summation_type: string;
  blinding: string;
  calculation_formula: string;
  material_name: string;
  coarse_aggregate: string;
  concrete_strength: string;
  slump: string;
  aggregate_strength_concrete_strength_slump: string;
  volume: number;
}
interface FormworkDataI {
  id: number;
  object_id: number;
  floor_id: number;
  sub_building_id: number;
  component_type: string;
  section_name: string;
  construction_zone: string;
  category: string;
  component_id: number;
  calculation_formula: string;
  formwork_position: string;
  formwork_type: string;
  area: number;
}
interface RebarDataI {
  id: number;
  object_id: number;
  floor_id: number;
  sub_building_id: number;
  component_type: string;
  section_name: string;
  construction_zone: string;
  category: string;
  component_id: number;
  calculation_formula: string;
  rebar_type: string;
  rebar_grade: string;
  rebar_diameter: number;
  rebar_shape_count: number;
  rebar_shape_length: number;
  rebar_unit_weight: number;
  rebar_id: number;
  rebar_count: number;
  rebar_weight: number;
}

//buildinginfo랑 setgriddata를 props로
const QuantityFilter = (props: any) => {
  // const [subBuildingIdName, setSubBuildingIdName] = useState<idNameI[]>();
  // const [subBuildingNameList, setSubBuildingNameList] = useState<string[]>();
  // const [selectedSubBuildingName, setSelectedSubBuildingName] =
  //   useState<string>();
  // const [selectedSubBuildingId, setSelectedSubBuildingId] = useState<number>();

  // const [floorIdName, setFloorIdName] = useState<idNameI[]>();
  // const [floorNameList, setFloorNameList] = useState<string[]>();
  // const [selectedFloorName, setSelectedFloorName] = useState<string>();
  // const [selectedFloorId, setSelectedFloorId] = useState<number>();

  // const [componentTypeList, setComponentTypeList] = useState<string[]>();
  // const [selectedComponentType, setSelectedComponentType] = useState<string>();

  const [subBuildingList, setSubBuildingList] = 
  useState<{ subBuilding: string; id: number; checked: boolean }[]>([]);
  const [selectedSubBuildingList, setSelectedSubBuildingList] =
    useState<{ subBuilding: string; id: number; checked: boolean }[]>(
      []
    );

  const [floorList,setFloorList ] = useState<
    {
      id: number;
      floorName: string;
      checked: boolean;
    }[]
  >([]);
  const [filteredFloorList, setFilteredFloorList] = useState<
    {
      id: number;
      floorName: string;
      checked: boolean;
    }[]
  >([]);
  const [selectedFloorList, setSelectedFloorList] = useState<
    {
      id: number;
      floorName: string;
      checked: boolean;
    }[]
  >([]);
  const [floorFilter, setFloorFilter] = useState<CompositeFilterDescriptor>(
    {
      logic: "or",
      filters: [],
    }
  );

    //id가 있어야되나
  const [componentTypeList, setComponentTypeList] = useState<
    {
      id: number;
      componentType: string;
      checked: boolean;
    }[]
  >([]);
  const [filteredComponentTypeList, setFilteredComponentTypeList] = useState<
    {
      id: number;
      componentType: string;
      checked: boolean;
    }[]
  >([]);
  const [selectedComponentTypeList, setSelectedComponentTypeList] = useState<
    {
      id: number;
      componentType: string;
      checked: boolean;
    }[]
  >([]);
  const [componentTypeFilter, setComponentTypeFilter] =
    useState<CompositeFilterDescriptor>({
      logic: "or",
      filters: [],
    });

  //const [isAnalyzable, setIsAnalyzable] = useState<boolean>(false);

  // 지금 buildinginfo를 가지고있으니까, buildingid가지고 그거의 subbuilding, floor, componenttype 처음에 다받아오기
  useEffect(() => {
    // setSubBuildingList
    // setFloorList
    // setComponentTypeList 다해야됨

    // fetch(urlPrefix.IP_port + "/dashboard/project", {
    //   method: "GET",
    //   headers: {
    //     Authorization: `Bearer ${localStorage.getItem("token")}`,
    //     "Content-Type": "application/json",
    //   },
    // })
    //   .then((response) => {
    //     if (!response.ok) {
    //       throw new Error("Network response was not ok");
    //     }
    //     return response.json();
    //   })
    //   .then((rawData) => {
    //     const data = JSON.parse(rawData);
    //     setProjectList(
    //       [
    //         {
    //           projectName: "All",
    //           id: 0,
    //           constructionCompany: "All",
    //           checked: false,
    //         },
    //       ].concat(
    //         data.map((item: any) => {
    //           return {
    //             projectName: item.project_name,
    //             id: item.id,
    //             constructionCompany: item.construction_company,
    //             checked: false,
    //           };
    //         })
    //       )
    //     );

    //     const uniqueConstructionCompanies = Array.from(
    //       new Set(data.map((item: any) => item.construction_company))
    //     );
    //     setConstructionCompanyList(
    //       [{ constructionCompany: "All", id: 0, checked: false }].concat(
    //         uniqueConstructionCompanies.map((constructionCompany: any) => {
    //           const item = data.find(
    //             (item: any) => item.construction_company === constructionCompany
    //           );
    //           return { constructionCompany, id: item.id, checked: false };
    //         })
    //       )
    //     );
    //   })
    //   .catch((error) => console.error("Error:", error));
  }, []);

  useEffect(()=>{setFilteredFloorList(floorList)},[floorList])
  // const getGrid = () => {
  //   const url = new URL(
  //     `${urlPrefix.IP_port}/sub_building/quantity_detail/show_table/${selectedSubBuildingId}/${selectedFloorId}/${selectedComponentType}/${props.selectedType}`
  //   );
  //   fetch(url, {
  //     method: "GET",
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       "Content-Type": "application/json",
  //     },
  //   })
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error("Network response was not ok");
  //       }
  //       return response.json();
  //     })
  //     .then((rawData) => {
  //       console.log(JSON.parse(rawData));
  //       // 어차피 똑같으면 합쳐도 될듯
  //       switch (props.selectedType) {
  //         case "concrete":
  //           const concreteData: ConcreteDataI[] = JSON.parse(rawData);
  //           props.setGridData(
  //             concreteData
  //               .map(({ id, sub_building_id, component_id, ...rest }) => rest)
  //               .map(({ component_type, ...rest }) => ({ ...rest }))
  //           );
  //           break;
  //         case "formwork":
  //           const formworkData: FormworkDataI[] = JSON.parse(rawData);
  //           props.setGridData(
  //             formworkData.map(
  //               ({ id, sub_building_id, component_id, ...rest }) => rest
  //             )
  //           );
  //           break;
  //         case "rebar":
  //           const rabarData: RebarDataI[] = JSON.parse(rawData);
  //           props.setGridData(
  //             rabarData.map(
  //               ({ id, sub_building_id, component_id, ...rest }) => rest
  //             )
  //           );
  //           break;
  //         default:
  //       }
  //     })
  //     .catch((error) => console.error("Error:", error));
  // };

  return (
    <div className="filters-button-container">
      {/* <div className="first-line-container">
        <DropDownList
          data={subBuildingNameList}
          value={selectedSubBuildingName}
          onChange={onSelectedSubBuildingChange}
          disabled={false}
          style={{ width: "59%", margin: "1%" }}
        />
        <DropDownList
          data={floorNameList}
          value={selectedFloorName}
          onChange={onSelectedFloorNameChange}
          disabled={false}
          style={{ width: "59%", margin: "1%" }}
        />
        <DropDownList
          data={componentTypeList}
          value={selectedComponentType}
          onChange={onSelectedComponentTypeChange}
          disabled={false}
          style={{ width: "59%", margin: "1%" }}
        />
        <Button
          onClick={getGrid}
          // disabled={selectedComponentType===""}
          style={{
            backgroundColor: "rgb(25, 101, 203)",
            color: "white",
            width: "5vw",
            height: "4vh",
          }}
        >
          Apply
        </Button>
      </div> */}
    </div>
  );
};

export default QuantityFilter;
