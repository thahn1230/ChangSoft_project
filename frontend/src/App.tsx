import React, { useState, createContext, useContext, useEffect } from "react";
import "./App.css";
import {
  Navigate,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { NavigationLayout } from "./component/NavgationLayout";
import { Home } from "./pages/Home";
import Projects from "./pages/Projects";
import UserPage from "./pages/User";
import Insight from "./pages/Insight";
import { BuildingInfo } from "interface/BuildingInterface";
import SubBuildingTabLayout from "./component/SubBuildingTabLayout";
import AIQuery from "./pages/AIQuery";
import LoginPage from "./pages/Login";

const BuildingInfoContext = createContext<
  | [
    BuildingInfo | undefined,
      React.Dispatch<React.SetStateAction<BuildingInfo | undefined>>
    ]
  | undefined
>(undefined);
const ProjectNameContext = createContext<
  [string, React.Dispatch<React.SetStateAction<string>>] | undefined
>(undefined);

export function useBuildingInfo() {
  const context = useContext(BuildingInfoContext);
  if (!context) {
    throw new Error(
      "useBuildingInfo must be used within a BuildingInfoProvider"
    );
  }
  return context;
}
export function useProjectName() {
  const context = useContext(ProjectNameContext);
  if (!context) {
    throw new Error("useProjectName must be used within a ProjectNameProvider");
  }
  return context;
}


export function App() {
  const [buildingInfo, setBuildingInfo] = useState<
  BuildingInfo | undefined
  >();
  const [projectName, setProjectName] = useState<string>("project");


  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token === null && location.pathname !== "/") navigate("/");
  }, [location]);

  return (
    <div>
      <BuildingInfoContext.Provider value={[buildingInfo, setBuildingInfo]}>
        <ProjectNameContext.Provider value={[projectName, setProjectName]}>
          <div className="App">
            <Routes>
              {/* 로그인 페이지와 가입 페이지는 NavigationLayout 밖으로 이동 */}
              <Route path="/" element={<LoginPage />} />

              {/* NavigationLayout 이하의 페이지들 */}
              <Route
                path="/home"
                element={
                  <NavigationLayout>
                    <Home />
                  </NavigationLayout>
                }
              />
              <Route
                path="/projects"
                element={
                  <NavigationLayout>
                    <Projects/>
                  </NavigationLayout>
                }
              />
              <Route
                path="/insight"
                element={
                  <NavigationLayout>
                    <Insight />
                  </NavigationLayout>
                }
              />
              <Route
                path="/user_info"
                element={
                  <NavigationLayout>
                    <UserPage />
                  </NavigationLayout>
                }
              />
              <Route
                path="/sub_building_detail"
                element={
                  <NavigationLayout>
                    <SubBuildingTabLayout/>
                  </NavigationLayout>
                }
              />
              <Route
                path="/ai_query"
                element={
                  <NavigationLayout>
                    <AIQuery />
                  </NavigationLayout>
                }
              />
            </Routes>
          </div>
        </ProjectNameContext.Provider>
      </BuildingInfoContext.Provider>
    </div>
  );
}
