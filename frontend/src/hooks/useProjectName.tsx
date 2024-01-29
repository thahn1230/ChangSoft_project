import { useContext } from 'react';
import { ProjectNameContext } from 'context/ProjectNameContext';

const useProjectName = () => {
  const context = useContext(ProjectNameContext);
  if (!context) {
    throw new Error('useProjectName must be used within a ProjectNameProvider');
  }
  return context;
};

export {useProjectName};
