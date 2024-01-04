import { useState, useEffect } from "react";
import styled from "styled-components";
import { getProjectNumber } from "services/dashboard/dashboardService";

const TotalWrapper = styled.div`
  @import url("https://fonts.googleapis.com/css2?family=Inter&display=swap");

  display: flex;
  justify-content: center;
  /* 가로 가운데 정렬 */
  font-family: "Inter", sans-serif !important;
  font-size: 10vh;
  color: #00028f;
  position: relative;

  .project-child {
    position: absolute;
    transform: translate(0, -10%);
  }
`;

const TotalProject = () => {
  const [projectNum, setProjectNum] = useState(0);

  useEffect(() => {
    getProjectNumber()
      .then((projectNumData) => {
        setProjectNum(projectNumData);
      })
      .catch((error) => {});
  }, []);

  return (
    <TotalWrapper>
      <div className="project-child">{projectNum}</div>
    </TotalWrapper>
  );
};

export default TotalProject;
