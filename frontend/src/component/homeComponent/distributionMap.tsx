import React, { useState, useEffect } from "react";
import {
  Map,
  TileUrlTemplateArgs,
  MapLayers,
  MapBubbleLayer,
  MapShapeLayer,
  MapTileLayer,
  MapMarkerLayer,
} from "@progress/kendo-react-map";
import urlPrefix from "../../resource/URL_prefix.json";
import { location } from "../../interface/location";
import { coordinate } from "../../interface/coordinate";
import axios, { AxiosRequestConfig } from "axios";
import { useTokenContext, addTokenToRequest } from "../../TokenContext";
// import GoogleMap_API_KEY from "./../../resource/googleMap_API_KEY.json"

const tileSubdomains = ["a", "b", "c"];
const tileUrl = (e: TileUrlTemplateArgs) =>
  `https://${e.subdomain}.tile.openstreetmap.org/${e.zoom}/${e.x}/${e.y}.png?layers=T`;
const attribution =
  '&copy; <a href="https://osm.org/copyright">OpenStreetMap contributors</a>';

const reqPrefix = "https://maps.googleapis.com/maps/api/geocode/json?address=";
let address = "";
// const reqPostfix = "&key=" + GoogleMap_API_KEY

const geoShapes = [
  {
    type: "Polygon",
    coordinates: [
      // Note that GeoJSON coordinates are listed as Longitude, Latitude (X, Y).
      // Map locations are typically listed as Latitude, Longitude as in the other Map properties.
      [
        [-97.7409, 30.2675],
        [-97.7409, 30.2705],
        [-97.749, 30.2707],
        [-97.7494, 30.2686],
        [-97.7409, 30.2675],
      ],
    ],
  },
];
const markerStyle = {
  fill: {
    color: "#fff",
    opacity: 0.5,
  },
  stroke: {
    width: 3,
    color: "#bbb",
  },
};

const DistributionMap = () => {
  const [markers, setMarkers] = useState<coordinate[]>([]);
  const tokenContext = useTokenContext();

  useEffect(() => {
    if (tokenContext?.token === undefined) return;
    // axios.interceptors.request.use((config: AxiosRequestConfig) =>
    //   addTokenToRequest(config, tokenContext?.token)
    // );
    // const response = await axios.get(
    //   urlPrefix.IP_port + "/dashboard/project/map"
    // );
    fetch(urlPrefix.IP_port + "/dashboard/project/map", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setMarkers(data))
      .catch((error) => console.error("Error:", error));
  }, []);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Map center={[34, 128]} zoom={6} style={{ width: "100%" }}>
        <MapLayers>
          <MapTileLayer
            urlTemplate={tileUrl}
            subdomains={tileSubdomains}
            attribution={attribution}
          />
          <MapShapeLayer data={geoShapes} style={markerStyle} />

          <MapBubbleLayer
            data={markers}
            locationField="latlng"
            //size is determined by ratio of numOfBuildings
            valueField="sum"
            style={markerStyle}
          />

          {/* <MapMarkerLayer
            data={markers}
            locationField="latlng"
            titleField="name"
          /> */}
        </MapLayers>
      </Map>
    </div>
  );
};

export default DistributionMap;
