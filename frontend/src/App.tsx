import React, { useState, createContext, useContext, useEffect } from "react";
import "./App.css";
import {
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { NavigationLayout } from "./component/common/NavgationLayout";
import { Home } from "./pages/HomePage";
import Projects from "./pages/ProjectPage";
import UserPage from "./pages/UserPage";
import Insight from "./pages/InsightPage";
import SubBuildingTabLayout from "./component/common/SubBuildingTabLayout";
import AIQuery from "./pages/AIQueryPage";
import LoginPage from "./pages/Auth/LoginPage";

import {BuildingInfoProvider} from "context/BuildingInfoContext"
import {ProjectNameProvider} from "context/ProjectNameContext"


export function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token === null && location.pathname !== "/") navigate("/");
  }, [location]);

  return (
    <div>
      <BuildingInfoProvider>
        <ProjectNameProvider>
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
                path="/projects/sub_building_detail"
                element={
                  <NavigationLayout>
                    <SubBuildingTabLayout/>
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
                path="/ai_query"
                element={
                  <NavigationLayout>
                    <AIQuery />
                  </NavigationLayout>
                }
              />
            </Routes>
          </div>
        </ProjectNameProvider>
      </BuildingInfoProvider>
    </div>
  );
}
