export interface Building {
  id: number;
  building_name: string;
  building_type: string;
  project_id: number;
  sub_bldg_list: string;
}

export interface BuildingInfo {
  id: number;
  building_name: string;
  screenshot: null | string;
  total_area: null | number;
  stories: null | number;
  height: null | number;
  construction_method: null | string;
  structure_type: null | string;
  top_down: null | string;
  plane_shape: null | string;
  foundation_type: null | string;
  structure_code: null | string;
  performance_design_target: null | string;
  project_id: number;
}
