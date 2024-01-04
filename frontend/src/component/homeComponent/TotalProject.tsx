import { useState, useEffect } from "react";
import styled from "styled-components";

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
    fetch(`${process.env.REACT_APP_API_URL}/dashboard/project/count`, {
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
    <TotalWrapper>
      <div className="project-child">{projectNum}</div>
    </TotalWrapper>
  );
};

export default TotalProject;
