import { useContext } from 'react';
import { BuildingInfoContext } from 'context/BuildingInfoContext'; 

const useBuildingInfo = () => {
  const context = useContext(BuildingInfoContext);
  if (!context) {
    throw new Error('useBuildingInfo must be used within a BuildingInfoProvider');
  }
  return context;
};

export {useBuildingInfo};
