import React, { useState } from "react";
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

function App() {
  const [buildingInfo, setBuildingInfo] = useState<
    buildingInfo_interface | undefined
  >();
  const [projectName, setProjectName] = useState<string>("");

  return (
    <div className="App">
      <NavigationLayout>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Home />} />
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
          <Route path = "/ai_query" element={< AIQuery/>}/>
        </Routes>
      </NavigationLayout>
    </div>
  );
}

export default App;
