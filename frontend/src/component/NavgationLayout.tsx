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

  const [userInfo, setUserInfo] = useState<{name:string, email:string}>({name:"login please~", email:""});
  const [name, setName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");


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
    fetch(urlPrefix.IP_port + "/user/profile", {
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
        //setUserInfo({name :data.name, email: data.email_address})
        setName(data.name);
        setEmailAddress(data.email_address);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  const renderSelectedText = () => {
    return "BuilderHub SmartDB System";
  };

  const signOutClicked = () => {
    localStorage.removeItem("token")
    navigate("/")
  };

  const getUserContainerStyle = () => {
    return expanded
      ? { height: "230px", marginTop:"-262px", zIndex:"100000"}
      : { height: "0px", expanded: `${expanded}`};
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
            <div>
              {props.children}
              <Outlet />
            </div>
          </DrawerContent>
        </Drawer>

        {!expanded ? (
          <div></div>
        ) : (
          <div className="user-container" style={getUserContainerStyle()}>
            {/* <img alt="UserImg" src={tempIMG} width={110} style={{borderRadius: "70%"}} /> */}
             {/* <h1>
              {name !== null ? name : null}
            </h1>
            <div className="user-email" style={{marginTop: "1%", marginBottom: "3%"}}>
              {emailAddress !== null ? emailAddress : null}
            </div> */}
              <Button className="user-button k-button k-button-md k-rounded-md k-button-solid k-button-solid-base" onClick={signOutClicked}>
                Sign Out
              </Button>
          </div>
        )}
      </div>
    </div>
  );
};
