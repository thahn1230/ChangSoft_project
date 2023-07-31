import React, { useEffect } from "react";
import { Grid, GridColumn, GridEvent } from "@progress/kendo-react-grid";

import "./../../../styles/subBuildingAnalysisTable.scss";

const concreteColumns = [
  "빌딩명",
  "분류",
  "구성",
  "건물유형",
  "건물분류",
  "건물명",
  "층유형",
  "층분류",
  "층번호",
  "층이름",
  "시공존",
  "부재",
  "부재명",
  "분류명",
  "값",
  "객체ID",
  "할증",
  "값(할증)",
  "BOQ코드",
  "BOQ명칭",
  "BOQ규격",
  "BOQ단위",
  "산출식",
  "재질명",
  "굵은골재",
  "Conc_강도",
  "슬럼프",
  "골재-강도-슬럼프",
  "체적",
];

const formworkColumns = [
  "빌딩명",
  "분류",
  "구성",
  "건물유형",
  "건물분류",
  "건물명",
  "층유형",
  "층분류",
  "층번호",
  "층이름",
  "시공존",
  "부재",
  "부재명",
  "분류명",
  "값",
  "객체ID",
  "할증",
  "값(할증)",
  "BOQ코드",
  "BOQ명칭",
  "BOQ규격",
  "BOQ단위",
  "산출식",
  "형틀위치",
  "형틀유형",
  "면적",
];
const rebarColumns = [
  "빌딩명",
  "분류",
  "구성",
  "건물유형",
  "건물분류",
  "건물명",
  "층유형",
  "층분류",
  "층번호",
  "층이름",
  "시공존",
  "부재",
  "부재명",
  "분류명",
  "값",
  "객체ID",
  "할증",
  "값(할증)",
  "BOQ코드",
  "BOQ명칭",
  "BOQ규격",
  "BOQ단위",
  "산출식",
  "철근타입",
  "철근강종",
  "철근직경",
  "철근형상개수",
  "철근형상길이",
  "철근단위중량",
  "철근ID",
  "개수",
  "중량",
];

const SingleColTable = (props: any) => {
  return (
    <div>
      {props.data.length > 0 ? (
        <div className="analysis-table-container">
          <div>
            <Grid
              data={props.data}
              style={{ width: "100%", height: "60vh" }}
              scrollable="scrollable"
              fixedScroll={true}
            >
              {props.data !== undefined &&
                Object.keys(props.data[0]).map((item, index) => {
                  const newKey = Object.keys(props.data[0])[index];
                  return (
                    <GridColumn
                      key={index}
                      field={newKey}
                      title={newKey}
                      format={newKey.includes("id") ? "" : "{0:n2}"}
                      headerClassName="custom-header-cell"
                      className={
                        Object.keys(props.data[0])[index] === ""
                          ? ""
                          : "custom-number-cell"
                      }
                      width={"130"}
                    />
                  );
                })}
            </Grid>
          </div>
          <br></br>
        </div>
      ) : (
        <div>No data available</div>
      )}
    </div>
  );
};

export default SingleColTable;
