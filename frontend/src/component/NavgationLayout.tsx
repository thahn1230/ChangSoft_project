import React, { useState, useEffect } from "react";
import { Button } from "@progress/kendo-react-buttons";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { Drawer, DrawerContent } from "@progress/kendo-react-layout";
import "./../styles/NavigationLayout.scss";
import ChangSoftLogo from "./../resource/changSoft_logo.png";
import ChatgptLogo from "./../resource/chatgpt_logo.png";

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

  const renderSelectedText = () => {
    return "BuilderHub SmartDB System";
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
            {props.children}
            <Outlet />
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};
