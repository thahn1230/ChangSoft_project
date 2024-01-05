import apiService from "services/apiService";
import { CompanyInfo } from "interface/InsightInterface";

const getProjectWithCompanyList = async () => {
  try {
    const response = await apiService.get("dashboard/project", true);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const rawData = await response.json();
    const data = JSON.parse(rawData);

    const projectList = [
      { projectName: "All", id: 0, constructionCompany: "All", checked: false },
      ...data.map((item: any) => ({
        projectName: item.project_name,
        id: item.id,
        constructionCompany: item.construction_company,
        checked: false,
      })),
    ];

    const uniqueConstructionCompanies = Array.from(
      new Set(data.map((item: any) => item.construction_company))
    );


    const stringConstructionCompanies: string[] =
      uniqueConstructionCompanies.map(String);

    const constructionCompanyList: CompanyInfo[] = [
      { constructionCompany: "All", id: 0, checked: false },
      ...stringConstructionCompanies.map((constructionCompany) => {
        const item = data.find(
          (item: any) => item.construction_company === constructionCompany
        );

        // item이 undefined일 경우에 대한 처리
        const itemId = item ? item.id : -1;

        return { constructionCompany, id: itemId, checked: false };
      }),
    ];

    return { projectList, constructionCompanyList };
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

const getBuildingListInProject = async (selectedProjectId: Number) => {
  const response = await apiService.get(
    `project/${selectedProjectId}/building_detail`,
    true
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const rawData = await response.json();
  const data = JSON.parse(rawData);

  const buildingList = [{ buildingName: "All", id: 0, checked: false }].concat(
    data.map((item: any) => {
      return {
        buildingName: item.building_name,
        id: item.id,
        checked: false,
      };
    })
  );

  return buildingList;
};

const getInsightGraph = async (
  selectedInsightIndexInList: number,
  selectedConstructionCompanyList: {
    constructionCompany: string;
    id: number;
    checked: boolean;
  }[],
  selectedProjectList: {
    projectName: string;
    id: number;
    constructionCompany: string;
    checked: boolean;
  }[],
  selectedBuildingList: {
    buildingName: string;
    id: number;
    checked: boolean;
  }[]
) => {
  try {
    const params = new URLSearchParams();
    let paramName = "data";
    let paramContent;

    switch (selectedInsightIndexInList + 1) {
      case 4:
        paramContent = JSON.stringify(
          selectedConstructionCompanyList.map(
            (item: any) => item.constructionCompany
          )
        );
        break;
      case 5:
        paramContent = JSON.stringify(
          selectedProjectList.map((item: any) => item.id)
        );
        break;
      case 6:
        const selectedProjectId = [selectedProjectList[0].id];
        const selectedBuildingId = selectedBuildingList.map(
          (item: any) => item.id
        );
        paramContent = JSON.stringify(
          selectedProjectId.concat(selectedBuildingId)
        );
        break;
      default:
        paramContent = JSON.stringify(
          selectedProjectList.map((item: any) => item.id)
        );
    }

    params.append(paramName, paramContent);

    const url = new URL(
      `${process.env.REACT_APP_API_URL}/insight/${
        selectedInsightIndexInList + 1
      }`
    );
    url.search = params.toString();

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const rawData = await response.json();
    const data = JSON.parse(rawData);

    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export { getProjectWithCompanyList, getBuildingListInProject, getInsightGraph };
