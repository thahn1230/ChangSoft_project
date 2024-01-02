//project_interface
export interface ProjectInfo {
    building_area: number;
    construction_company: string;
    construction_end: null | Date;
    construction_start: null | Date;
    created: number;
    ground_characteristics: null | string;
    id: number;
    location: string;
    project_name: string;
    rainfall: null | string;
    seismic_coefficient: null | string;
    total_area: number;
    updated: number;
    usage: string;
    wind_exposure_cat: string;
    wind_tunnel_test: null | string;
    zone: string;
  }

  export interface ProjectDetail {
    id: number;
    project_name: string;
    buildingTotalNum : number;
  }
  
  //projectList_interface
  export interface ProjectIdName {
    id: number;
    project_name: string;
  }

  