import { useState, useEffect } from "react";
import axios from "axios";
import urlPrefix from "../../resource/URL_prefix.json";
import "./../../styles/totalBuildingNum.scss";

const ProjectDetail = () => {
  const [buildingNum, setBuildingNum] = useState(0);

  useEffect(() => {
    fetch(urlPrefix.IP_port + "/dashboard/building/count", {
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
      .then((data) => {
        const arrayData = JSON.parse(data)
        setBuildingNum(arrayData);
      
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  return (
    <div className="total-building-num">
      <div className="building-child">{buildingNum}</div>
    </div>
  );
};

export default ProjectDetail;
