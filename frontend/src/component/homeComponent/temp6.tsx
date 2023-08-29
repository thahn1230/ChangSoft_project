import React, { useCallback, useEffect, useState } from "react";
import { Tooltip } from "@progress/kendo-react-tooltip";
import "@progress/kendo-ui";
import axios from "axios";

declare const kendo: any;
declare const window: any;

window.$ = window.jquery = jQuery;

interface CompanyData {
  construction_company: string;
  total_area_sum: number;
}

interface Item {
  value: number;
  name: string;
  change: string;
}

export const TotalAreaByCompany: React.FC = () => {
  const [data, setData] = useState<Item[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get<CompanyData[]>(
        "http://192.168.0.129:8000/dashboard/project/construction_company_total_area"
      );
      const companyData = response.data;

      const items: Item[] = companyData.map((item: CompanyData) => ({
        value: item.total_area_sum,
        name: item.construction_company,
        change: "",
      }));

      setData(items);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  const nFormatter = (num: number) => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1).replace(/\.0$/, "") + "B";
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
    }
    return num;
  };

  const toolTipTemplate = (props: any) => {
    if (
      props.title !== '{"value":1,"name":"Price' &&
      props.title !== '{"name":"Market'
    ) {
      let item = JSON.parse(props.title);
      return (
        <span>
          <span>Company: {item.name}</span>
          <br />
          <span>Change: {item.change}%</span>
          <br />
          <span>Market cap: {nFormatter(item.value)}</span>
        </span>
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const prizeUpItems = data.filter((item: Item) => item.value >= 0);

    const TreeData = [
      {
        value: 1,
        items: [
          { value: 1, name: "Price up", items: prizeUpItems },
          { value: 1, name: "Price down", items: [] }, // No prizeDownItems in the fetched data
        ],
      },
    ];

    window.$("#heatmap").kendoTreeMap({
      dataSource: new kendo.data.HierarchicalDataSource({
        data: TreeData,
        schema: {
          model: {
            children: "items",
          },
        },
      }),
      valueField: "value",
      textField: "name",
      colors: [
        ["#00AD51", "#00EF81"],
        ["#FF0000", "#FF8F8F"],
      ],
    });
  }, [data]);

  return (
    <div>
      <Tooltip showCallout={false} content={toolTipTemplate}>
        <div id="heatmap" style={{ height: 600, marginBottom: 50 }}></div>
      </Tooltip>
    </div>
  );
};
