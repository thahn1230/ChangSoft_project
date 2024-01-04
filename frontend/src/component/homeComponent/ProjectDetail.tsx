import { useState, useEffect } from "react";
import styled from "styled-components";
import { getBuildingNumber } from "services/dashboard/dashboardService";

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
    getBuildingNumber()
      .then((buildingNumData) => {
        setBuildingNum(buildingNumData);
      })
      .catch((error) => {});
  }, []);

  return (
    <TotalWrapper>
      <div className="building-child">{buildingNum}</div>
    </TotalWrapper>
  );
};

export default ProjectDetail;
