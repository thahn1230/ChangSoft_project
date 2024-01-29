import React, { createContext, useState, ReactNode } from "react";

const ProjectNameContext = createContext<
  [string, React.Dispatch<React.SetStateAction<string>>] | undefined
>(undefined);

interface ProjectNameProviderProps {
  children: ReactNode; 
}

// ProjectNameProvider 컴포넌트 정의
const ProjectNameProvider: React.FC<ProjectNameProviderProps> = ({ children }) => {
  const [state, setState] = useState(""); 

  return (
    <ProjectNameContext.Provider value={[state, setState]}>
      {children}
    </ProjectNameContext.Provider>
  );
};

export { ProjectNameContext, ProjectNameProvider };
