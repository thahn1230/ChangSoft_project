import { useContext } from 'react';
import { SubBuildingInfoContext } from 'context/SubBuildingInfoContext';

const useSubBuildingInfo = () => {
  const context = useContext(SubBuildingInfoContext);
  if (!context) {
    throw new Error('useSubBuildingInfo must be used within a ProjectNameProvider');
  }
  return context;
};

export {useSubBuildingInfo};
