import React, { useEffect, useState } from "react";
import {
  Grid,
  GridColumn,
  GridEvent,
  GridFilterChangeEvent,
  GridSortChangeEvent,
} from "@progress/kendo-react-grid";
import {
  filterBy,
  CompositeFilterDescriptor,
} from "@progress/kendo-data-query";
import { orderBy, SortDescriptor } from "@progress/kendo-data-query";
import "styles/subBuildingAnalysisTable.scss";
import loadingBar from "resource/loadingBars.gif";

const SingleColTable = (props: any) => {
  const [filter, setFilter] = useState<CompositeFilterDescriptor>({
    logic: "and",
    filters: [],
  });
  const [sort, setSort] = useState<SortDescriptor[]>([
    {
      field: "층이름",
      dir: "desc",
    },
  ]);

  
  return (
    <div>
      {props.isLoading ? (
        <img
          alt="loader"
          src={loadingBar}
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: "10%",
          }}
        />
      ) : props.data.length !== 0 ? (
        <div className="analysis-table-container">
          <div>
            <Grid
              data={orderBy(filterBy(props.data, filter), sort)}
              style={{ width: "100%", height: "60vh" }}
              scrollable="scrollable"
              fixedScroll={true}
              filterable={true}
              filter={filter}
              onFilterChange={(e: GridFilterChangeEvent) => setFilter(e.filter)}
              sortable={true}
              sort={sort}
              onSortChange={(e: GridSortChangeEvent) => {
                setSort(e.sort);
              }}
            >
              {props.data !== undefined &&
                Object.keys(props.data[0]).map((item, index) => {
                  const newKey = Object.keys(props.data[0])[index];
                  return (
                    <GridColumn
                      key={index}
                      field={newKey}
                      title={newKey}
                      format={
                        newKey.includes("ID") || newKey.includes("id")
                          ? ""
                          : "{0:n2}"
                      }
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
