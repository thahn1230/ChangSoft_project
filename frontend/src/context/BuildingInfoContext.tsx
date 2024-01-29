import React, { createContext, useState, ReactNode } from "react";
import { BuildingInfo } from "interface/BuildingInterface";

const BuildingInfoContext = createContext<
  [BuildingInfo | undefined, React.Dispatch<React.SetStateAction<BuildingInfo | undefined>>] | undefined
>(undefined);

interface BuildingInfoProviderProps {
  children: ReactNode;
}

const BuildingInfoProvider: React.FC<BuildingInfoProviderProps> = ({ children }) => {
  const [buildingInfo, setBuildingInfo] = useState<BuildingInfo | undefined>(undefined);

  return (
    <BuildingInfoContext.Provider value={[buildingInfo, setBuildingInfo]}>
      {children}
    </BuildingInfoContext.Provider>
  );
};

export { BuildingInfoContext, BuildingInfoProvider };
