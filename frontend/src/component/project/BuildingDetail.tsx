import React, { useState, useEffect } from "react";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { Button } from "@progress/kendo-react-buttons";
import { useNavigate } from "react-router-dom";
import { useBuildingInfo } from "hooks/useBuildingInfo";
import { getImagePath } from "services/building/buildingService";

import "styles/GridDetail.scss";

const BuildingDetail = (props: { forAnalysisTab: boolean }) => {
  const [imgPath, setImgPath] = useState<string>("");
  const [buildingInfo, setBuildingInfo] = useBuildingInfo();

  useEffect(() => {
    if (buildingInfo?.id === undefined) return;
    getImagePath(buildingInfo?.id)
      .then((imgPath) => setImgPath(imgPath))
      .catch((error) => console.error("Error:", error));
  }, [buildingInfo]);

  const navigate = useNavigate();
  const onClick = () => {
    navigate("/projects/sub_building_detail");
  };

  const headerClassName = "custom-header-cell";

  return (
    <div>
      <div style={{ width: "30%", float: "left", paddingLeft: "1%" }}>
        {imgPath && (
          <img
            src={imgPath}
            alt="Building Image"
            style={{ width: "163%", float: "left" }}
          />
        )}
      </div>
      <div style={{ width: "50%", float: "right", paddingLeft: "1%" }}>
        {!props.forAnalysisTab && (
          <div>
            <Button
              onClick={onClick}
              style={{
                backgroundColor: "rgb(53, 53, 219)",
                color: "white",
                marginBottom: "10px",
                marginTop: "5px",
                width: "6vw",
                height: "4vh",
                marginLeft: "1%",
              }}
            >
              상세보기
            </Button>
          </div>
        )}
        <Grid data={[buildingInfo]}>
          <GridColumn
            field="building_name"
            title="빌딩 이름"
            headerClassName={headerClassName}
            className="custom-text-cell"
          />
        </Grid>
        <Grid data={[buildingInfo]}>
          <GridColumn
            field="total_area_square_meter"
            title="전체 면적(㎡)"
            headerClassName={headerClassName}
            className="custom-number-cell"
            format={"{0:n2}"}
          />
          <GridColumn
            field="stories_above_below"
            title="층수(지상/지하, 층)"
            headerClassName={headerClassName}
            className="custom-number-cell"
          />
          <GridColumn
            field="height_above_below"
            title="높이(지상/지하, m)"
            headerClassName={headerClassName}
            className="custom-number-cell"
          />
          <GridColumn
            field="construction_method"
            title="공법"
            headerClassName={headerClassName}
          />
        </Grid>

        <Grid data={[buildingInfo]}>
          <GridColumn
            field="top_down"
            title="탑다운"
            headerClassName={headerClassName}
          />
          <GridColumn
            field="plane_shape"
            title="평면현상"
            headerClassName={headerClassName}
          />
          <GridColumn
            field="foundation_type"
            title="기초타입"
            headerClassName={headerClassName}
          />
          <GridColumn
            field="structure_code"
            title="규준"
            headerClassName={headerClassName}
          />
          <GridColumn
            field="performance_design_target"
            title="내진설계"
            headerClassName={headerClassName}
          />
        </Grid>
      </div>
    </div>
  );
};

export default BuildingDetail;
