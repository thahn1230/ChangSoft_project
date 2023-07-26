import React, { useState, createContext, useContext, ReactNode } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import { NavigationLayout } from "./component/NavgationLayout";
import { Home } from "./pages/Home";
import Projects from "./pages/Projects";
import UserPage from "./pages/user";
import Insight from "./pages/insight";
import { buildingInfo_interface } from "./interface/buildingInfo_interface";
import SubBuildingTabLayout from "./component/subBuildingTabLayout";
import AIQuery from "./pages/AIQuery";
import LoginPage from "./pages/Login";
import { UserInfoI } from "./interface/userInfo_interface";
import { UserContextProvider } from "./UserInfoContext";
import Join from "./pages/LoginPages/Join"

export function App() {
  const [buildingInfo, setBuildingInfo] = useState<
    buildingInfo_interface | undefined
  >();
  const [projectName, setProjectName] = useState<string>("");

  return (
    <UserContextProvider>
      <div className="App">
        <NavigationLayout>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/join" element={<Join />} />

            <Route path="/home" element={<Home />} />
            <Route
              path="/projects"
              element={
                <Projects
                  setBuildingInfo={setBuildingInfo}
                  setProjectName={setProjectName}
                />
              }
            />
            <Route path="/insight" element={<Insight />} />
            <Route path="/user_info" element={<UserPage />} />
            <Route
              path="/sub_building_detail"
              element={
                <SubBuildingTabLayout
                  buildingInfo={buildingInfo}
                  projectName={projectName}
                />
              }
            />
            <Route path="/ai_query" element={<AIQuery />} />
          </Routes>
        </NavigationLayout>
      </div>
    </UserContextProvider>
  );
}
