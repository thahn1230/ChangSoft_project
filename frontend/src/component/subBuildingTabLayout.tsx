import React, { useState, useEffect } from "react";
import { Button } from "@progress/kendo-react-buttons";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { Drawer, DrawerContent } from "@progress/kendo-react-layout";
import "./../styles/NavigationLayout.scss";
import LogoImg from "./../resource/changSoft_logo.png";

interface MenuItem {
  text: string;
  selected: boolean;
  route: string;
}

export const items: MenuItem[] = [
  {
    text: "개요",
    selected: true,
    route: "/sub_building_detail/개요"
  },
  {
    text: "총괄분석표",
    selected: false,
    route: "/sub_building_detail/총괄분석표"
  },
  {
    text: "분석표",
    selected: false,
    route: "/sub_building_detail/분석표"
  },
  {
    text: "층별분석표",
    selected: false,
    route: "/sub_building_detail/층별분석표"
  },
];

export const SubBuildingTabLayout = (props: any) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expanded, setExpanded] = useState(true);
  const [selected, setSelected] = useState("");

  const handleClick = () => {
    setExpanded(!expanded);
  };

  const onSelect = (e: any) => {
    navigate(e.itemTarget.props.route);
  };

  useEffect(() => {
    const selectedItem = items.find((item) => item.route === location.pathname);
    if (selectedItem) {
      setSelected(selectedItem.text);
    }
  }, [location.pathname]);


  return (
    <div>
      <div>
        <Drawer
          expanded={expanded}
          position="start"
          mode="push"
          width={240}
          items={items.map((item) => ({
            ...item,
            selected: item.text === selected,
          }))}
          onSelect={onSelect}
          className="drawer"
        >
          <DrawerContent>
            <Outlet />
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};

export default SubBuildingTabLayout;