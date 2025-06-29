import React, { useState } from 'react';
import { SingleRunContext, SingleRunState } from '../../context/single-run-context';

export const SingleRunProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [singleRunState, setSingleRunState] = useState<SingleRunState>({
    visible: false
  });

  const openSingleRun = (nodeId: string, canvasId: string, nodeTitle?: string) => {
    setSingleRunState({
      visible: true,
      nodeId,
      canvasId,
      nodeTitle
    });
  };

  const closeSingleRun = () => {
    setSingleRunState({
      visible: false
    });
  };

  return (
    <SingleRunContext.Provider
      value={{
        singleRunState,
        setSingleRunState,
        openSingleRun,
        closeSingleRun
      }}
    >
      {children}
    </SingleRunContext.Provider>
  );
}; 