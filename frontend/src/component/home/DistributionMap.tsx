import React, { useState, useEffect } from "react";
import {
  Map,
  TileUrlTemplateArgs,
  MapLayers,
  MapBubbleLayer,
  MapShapeLayer,
  MapTileLayer,
} from "@progress/kendo-react-map";
import { Coordinate } from "interface/DashBoardInterface";
import styled from "styled-components";
import { getMarkerData } from "services/dashboard/dashboardService";

const MapWrapper = styled.div`
  display: flex;
  alignitems: center;
  justifycontent: center;

  .distributionMapClass {
    width: 100%;
  }
`;

const tileSubdomains = ["a", "b", "c"];
const tileUrl = (e: TileUrlTemplateArgs) =>
  `https://${e.subdomain}.tile.openstreetmap.org/${e.zoom}/${e.x}/${e.y}.png?layers=T`;
const attribution =
  '&copy; <a href="https://osm.org/copyright">OpenStreetMap contributors</a>';

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
  const [markers, setMarkers] = useState<Coordinate[]>([]);

  useEffect(() => {
    getMarkerData()
      .then((markerData) => {
        setMarkers(markerData);
      })
      .catch((error) => {});
  }, []);

  return (
    <MapWrapper>
      <Map center={[34, 128]} zoom={6} className="distributionMapClass">
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
        </MapLayers>
      </Map>
    </MapWrapper>
  );
};

export default DistributionMap;
