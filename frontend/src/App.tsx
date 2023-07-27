import React, {
  useState,
  createContext,
  useContext,
  ReactNode,
  useEffect,
} from "react";
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
import UserPage from "./pages/user";
import Insight from "./pages/insight";
import { buildingInfo_interface } from "./interface/buildingInfo_interface";
import SubBuildingTabLayout from "./component/subBuildingTabLayout";
import AIQuery from "./pages/AIQuery";
import LoginPage from "./pages/Login";
import Join from "./pages/LoginPages/Join";

export function App() {
  const [buildingInfo, setBuildingInfo] = useState<
    buildingInfo_interface | undefined
  >();
  const [projectName, setProjectName] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log(location);
    const token = localStorage.getItem("token");
    if (
      token === null &&
      location.pathname !== "/" &&
      location.pathname !== "/join"
    )
      navigate("/");
  }, [location]);

  return (
    <div>
      <div className="App">
        <Routes>
          {/* 로그인 페이지와 가입 페이지는 NavigationLayout 밖으로 이동 */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/join" element={<Join />} />

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
                <Projects
                  setBuildingInfo={setBuildingInfo}
                  setProjectName={setProjectName}
                />
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
                <SubBuildingTabLayout
                  buildingInfo={buildingInfo}
                  projectName={projectName}
                />
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
    </div>
  );
}
