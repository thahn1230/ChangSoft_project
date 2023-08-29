import { useState, useEffect } from "react";
import axios from "axios";
import "./../../styles/totalProjectNum.scss";
import urlPrefix from "../../resource/URL_prefix.json";

const TotalProject = () => {
  const [projectNum, setProjectNum] = useState(0);

  useEffect(() => {
    fetch(urlPrefix.IP_port + "/dashboard/project/count", {
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
        const arrayData = JSON.parse(data);
        setProjectNum(arrayData);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  return (
    <div className="total-project-num">
      <div className="project-child">{projectNum}</div>
    </div>
  );
};

export default TotalProject;
