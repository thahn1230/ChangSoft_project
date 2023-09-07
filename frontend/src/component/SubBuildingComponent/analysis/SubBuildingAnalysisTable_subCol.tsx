import React from "react";
import { Grid, GridColumn, GridEvent } from "@progress/kendo-react-grid";

import "styles/subBuildingAnalysisTable.scss";

const SubBuildingAnalysisTableSubCol  = (props: any) => {
    return (
      <div>
        {props.data.length > 0 ? (
         <div className="analysis-table-container">
         <div>
           <Grid
             data={props.data}
             style={{ width:"100%",height: "60vh" }}
             scrollable="scrollable"
             fixedScroll={true}
           >
             <GridColumn
               title=""
               field=""
               headerClassName="custom-header-cell"
               width={"130"}
             ></GridColumn>
             {props.columns !== undefined &&
               props.columns.map((item: { [key: string]: any }) => {
                 const strengthName = Object.keys(item)[0];
                 const subColumns = item[strengthName];
                 
                 return Object.keys(item)[0] !== "" &&
                   Object.keys(item)[0] !== undefined ? (
                   <GridColumn
                     title={Object.keys(item)[0]}
                     headerClassName="custom-header-cell"
                     className="custom-number-cell"
                   >
                     {subColumns.map((diameter: string) => {
                       return (
                         <GridColumn
                           title={"D" + diameter}
                           field={strengthName + "." + diameter}
                           format="{0:n2}"
                           headerClassName="custom-header-cell"
                           className="custom-number-cell"
                           width={"130"}
                         ></GridColumn>
                       );
                     })}
                   </GridColumn>
                 ) : null;
               })}
           </Grid>
         </div>
       </div>
        ) : (
          <div>No data available</div>
        )}
      </div>
    );
  };

  export default SubBuildingAnalysisTableSubCol;
