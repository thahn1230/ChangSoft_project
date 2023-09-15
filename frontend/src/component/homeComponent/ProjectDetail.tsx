import { useState, useEffect } from "react";
import urlPrefix from "resource/URL_prefix.json";
import styled from "styled-components";

const TotalWrapper = styled.div`
@import urlimport styled from "styled-components";
('https://fonts.googleapis.com/css2?family=Inter&display=swap');

  display: flex;
  justify-content: center;
  /* 가로 가운데 정렬 */
  font-family: 'Inter', sans-serif !important;
  font-size: 10vh;
  color: #00028f;
  position: relative;

.building-child {
    position: absolute;
    transform: translate(0, -10%);
}
`;

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
        const arrayData = JSON.parse(data);
        setBuildingNum(arrayData);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  return (
    <TotalWrapper>
      <div className="building-child">{buildingNum}</div>
    </TotalWrapper>
  );
};

export default ProjectDetail;
