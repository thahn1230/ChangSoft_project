import React, { useState } from "react";
import {
  TileLayout,
  TileLayoutRepositionEvent,
} from "@progress/kendo-react-layout";
import TotalProject from "component/home/TotalProject";
import ProjectDetail from "component/home/ProjectDetail";
import DistributionMap from "component/home/DistributionMap";
import UsagePercentage from "component/home/UsagePercentage";
import CompanyPercentage from "component/home/CompanyPercentage";
import LocalPercentage from "component/home/LocalPercentage";
import TotalArea from "component/home/TotalArea";
import FloorCount from "component/home/FloorCount";
import "styles/Home.scss";

interface Tile {
  header: string;
  body: React.ReactNode;
}

const tiles: Tile[] = [
  {
    header: "총 프로젝트 수",
    body: <TotalProject />,
  },
  {
    header: "총 빌딩 수",
    body: <ProjectDetail />,
  },
  {
    header: "지역별 비율",
    body: <LocalPercentage />,
  },
  {
    header: "회사별 비율",
    body: <CompanyPercentage />,
  },
  {
    header: "용도별 비율",
    body: <UsagePercentage />,
  },
  {
    header: "프로젝트 연면적",
    body: <TotalArea />,
  },
  {
    header: "빌딩 층수",
    body: <FloorCount />,
  },
  {
    header: "프로젝트별 위치",
    body: <DistributionMap />,
  },
  // {
  //   header: "회사별 연면적",
  //   body: ""
  // },
];
const data: { col: number; colSpan: number; rowSpan: number }[] = [
  { col: 1, colSpan: 1, rowSpan: 1 }, // Total project
  { col: 1, colSpan: 1, rowSpan: 1 }, // Total Building
  { col: 2, colSpan: 2, rowSpan: 2 }, // Local %
  { col: 4, colSpan: 2, rowSpan: 2 }, // Company %
  { col: 6, colSpan: 2, rowSpan: 2 }, // Usage %
  { col: 1, colSpan: 3, rowSpan: 2 }, // Total Area
  { col: 4, colSpan: 2, rowSpan: 2 }, // Floor Count
  { col: 6, colSpan: 2, rowSpan: 2 }, // Map
];

export const Home: React.FC = () => {
  return (
    <div className="building-dashboard-container">
      <TileLayout
        columns={7}
        rowHeight={"21vh"}
        positions={data}
        gap={{ rows: 10, columns: 10 }}
        items={tiles.map((tile, index) => ({
          ...tile,
          reorderable: false,
          header: <strong>{tile.header}</strong>,
          body: <div className="tile-content">{tile.body}</div>,
        }))}
      />
    </div>
  );
};
