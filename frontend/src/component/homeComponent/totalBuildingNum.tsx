import { useState, useEffect } from "react";
import axios from "axios";
import urlPrefix from "./../../resource/URL_prefix.json";
import "./../../styles/totalBuildingNum.scss";

const ProjectDetail = () => {
  const [buildingNum, setBuildingNum] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response_num = await axios.get(
          urlPrefix.IP_port + "/dashboard/building/count"
        );

        const data = JSON.parse(response_num.data);
        setBuildingNum(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="total-building-num">
      <div className="building-child">{buildingNum}</div>
    </div>
  );
};

export default ProjectDetail;
