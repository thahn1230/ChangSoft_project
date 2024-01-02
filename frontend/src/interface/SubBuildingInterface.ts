export interface SubBuildingAnalysisPercentage {
  type: string;
  percentage: number;
}
export interface SubBuildingAnalysisTable {
  total_concrete: number;
  total_formwork: number;
  total_rebar: number;
  form_con_result: number;
  reb_con_result: number;
}
export interface SubBuildingAnalysisValue {
  type: string;
  value: number;
}
//이거 아님
export interface SubBuildingConcreteAnalysisTable {
  구분: string;
  C27: number;
  C27_무근: number;
  버림: number;
  "알폼(경사상부)": number;
  "알폼(경사하부)": number;
  "알폼(계단)": number;
  "알폼(수직)": number;
  "알폼(수평)": number;
  외벽: number;
  갱폼: number;
  유로폼: number;
  합판3회: number;
  합판4회: number;
  SHD10: number;
  SHD13: number;
  UHD16: number;
}
export interface SubBuildingInfo {
  id: number;
  sub_building_type: string;
  sub_building_category: string;
  sub_building_name: string;
  total_area_above: number;
  total_area_below: number;
  building_id: number;
}

//SubBuildingTotalAnalysisTable1
export interface SubBuildingTotalAnalysis1 {
  total_concrete: number;
  total_formwork: number;
  total_rebar: number;
  total_floor_area_meter: number;
  total_floor_area_pyeong: number;
  con_floor_area_meter: number;
  form_floor_area_meter: number;
  reb_floor_area_meter: number;
  con_floor_area_pyeong: number;
  form_floor_area_pyeong: number;
  reb_floor_area_pyeong: number;
  form_con_result: number;
  reb_con_result: number;
}

//SubBuildingTotalAnalysisTable2
export interface SubBuildingTotalAnalysis2 {
  component_type: string;
  concrete_volume: number;
  formwork_area: number;
  rebar_weight: number;
  concrete_percentage: number;
  formwork_percentage: number;
  rebar_percentage: number;
}
