import React, { useState, useEffect } from "react";
import { Button } from "@progress/kendo-react-buttons";
import { useLocation, useNavigate, Outlet, Link } from "react-router-dom";
import { Drawer, DrawerContent } from "@progress/kendo-react-layout";
import "./../styles/NavigationLayout.scss";
import ChangSoftLogo from "./../resource/changSoft_logo.png";
import tempIMG from "./../resource/temp.jpg";
import { useUserContext } from "../UserInfoContext";
import { useTokenContext } from "./../TokenContext";
import urlPrefix from "../resource/URL_prefix.json";
import exp from "constants";

interface MenuItem {
  text: string;
  selected: boolean;
  route: string;
  icon: string;
}

export const items: MenuItem[] = [
  {
    text: "Home",
    selected: false,
    route: "/home",
    icon: "home",
  },
  {
    text: "Projects",
    selected: false,
    route: "/projects",
    icon: "k-i-table-align-top-left",
  },
  {
    text: "Insight",
    selected: false,
    route: "/insight",
    icon: "k-i-align-bottom-element",
  },
  {
    text: "AI Query (Beta)",
    selected: false,
    route: "/ai_query",
    icon: "k-i-comment",
  },
  {
    text: "User",
    selected: false,
    route: "/user_info",
    icon: "user",
  },
];

export const NavigationLayout = (props: any) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expanded, setExpanded] = useState(true);
  const [selected, setSelected] = useState("");
  const tokenContext = useTokenContext();

  const handleClick = () => {
    setExpanded(!expanded);
  };

  const onSelect = (e: any) => {
    navigate(e.itemTarget.props.route);
    if (expanded) setExpanded(false);
  };

  useEffect(() => {
    const selectedItem = items.find((item) => item.route === location.pathname);
    if (selectedItem) {
      setSelected(selectedItem.text);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (tokenContext?.token === null) navigate("/");
  }, [tokenContext?.token]);

  useEffect(() => {
    fetch(urlPrefix.IP_port + '/user/profile', {
      method: "GET",
      headers: {
        // Authorization: `Bearer ${tokenContext?.token}`,
        Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6ImFkbWluIiwiY29tcGFueSI6Ilx1Y2MzZFx1YzE4Y1x1ZDUwNFx1ZDJiOFx1YzU0NFx1Yzc3NFx1YzU2NFx1YzU0NFx1Yzc3NCIsImVtYWlsX2FkZHJlc3MiOiJ0aGFobjEyMzBAY2hhbmctc29mdC5jb20iLCJ1c2VyX3R5cGUiOiJBZG1pbiIsImV4cCI6MTY5MDQyODQ5NX0.qIRiimpxc_2fAFIOBKXg_pQZQx9qlreve0I73kyaEDs`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => console.log(data))
      .catch((error) => console.error("Error in user profile:", error));
  }, [tokenContext]);

  const renderSelectedText = () => {
    return "BuilderHub SmartDB System";
  };

  const signOutClicked = () => {
    tokenContext?.setToken(null);
  };

  const getUserContainerStyle = () => {
    return expanded
      ? { height: "300px" }
      : { height: "300px", expanded: `${expanded}` };
  };

  const getMargin = () => {
    return expanded ? { marginTop: "-300px" } : { marginTop: "0px" };
  };

  return (
    <div>
      <div
        className="custom-toolbar"
        style={{
          background:
            "linear-gradient(135deg, rgb(22, 48, 138) 40%, rgb(255, 255, 255) 90%)",
        }}
      >
        <div>
          <Button
            icon="menu"
            onClick={handleClick}
            className="menu-button"
            style={{ color: "rgb(22, 48, 138)", backgroundColor: "white" }}
          />
          <span
            className={selected === "Projects" ? "selected-text" : ""}
            style={{ color: "white" }}
          >
            {renderSelectedText()}
          </span>
        </div>

        <div className="logo">
          {<img alt="LogoImg" src={ChangSoftLogo} height="50px" />}
        </div>
      </div>

      <div>
        {!expanded ? (
          <div style={getMargin()}></div>
        ) : (
          <div className="user-container" style={getUserContainerStyle()}>
            <img alt="UserImg" src={tempIMG} width={100} />
            <h1>
              {/* {userInfoContext !== null ? userInfoContext.userInfo?.name : null} */}
            </h1>
            <div className="user-email">
              {/* {userInfoContext !== null
              ? userInfoContext.userInfo?.email_address
              : null} */}
            </div>
            <Link to="/" style={{ textDecoration: "none" }}>
              <Button 
              className="user-button k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
              onClick={signOutClicked}
              >
                Sign Out
              </Button>
            </Link>
          </div>
        )}
        <Drawer
          expanded={expanded}
          position="start"
          mode="push"
          width={240}
          mini={true}
          items={items.map((item) => ({
            ...item,
            selected: item.text === selected,
          }))}
          onSelect={onSelect}
          className="drawer"
        >
          <DrawerContent>
            <div style={getMargin()}>
              {props.children}
              <Outlet />
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};
