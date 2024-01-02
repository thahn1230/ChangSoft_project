export interface Coordinate {
    latlng: [number,number];
    sum: number;
  }

  export interface Location {
    place_id: number;
    licence: string;
    osm_type: string;
    osm_id: number;
    boundingbox: [string, string, string, string];
    lat: string;
    lon: string;
    display_name: string;
    class: string;
    type: string;
    importance: number;
  }

  export interface PercentPercentage {
    field: string;
    count: number;
    percentage: number;
  }
  