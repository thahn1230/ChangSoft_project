import React, { useEffect, useState } from "react";
import axios from "axios";
import { Grid, GridColumn } from "@progress/kendo-react-grid";

const MyComponent = (props: any) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://192.168.0.129:8000/sub_building/analysis_table/${props.buildingId}/concrete`
        );
        const data = response.data;
        return data;
      } catch (error) {
        console.error(error);
      }
    };
  }, [props]);

  return (
    <Grid data={data}>
      <GridColumn field="component_type" title="Component Type" />
      <GridColumn field="material_name" title="Material Name" />
      <GridColumn field="total_concrete" title="Total Concrete" />
    </Grid>
  );
};

export default MyComponent;
