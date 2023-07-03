export interface project_interface {
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