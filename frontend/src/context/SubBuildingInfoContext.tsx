import React, { createContext, useState, ReactNode } from "react";

const SubBuildingInfoContext = createContext<[number, React.Dispatch<React.SetStateAction<number>>] | undefined>(undefined);

interface SubBuildingInfoProviderProps {
  children: ReactNode;
}

const SubBuildingInfoProvider: React.FC<SubBuildingInfoProviderProps> = ({ children }) => {
  const [subBuildingInfo, setSubBuildingInfo] = useState<number>(0);

  return (
    <SubBuildingInfoContext.Provider value={[subBuildingInfo, setSubBuildingInfo]}>
      {children}
    </SubBuildingInfoContext.Provider>
  );
};

export { SubBuildingInfoContext, SubBuildingInfoProvider };
