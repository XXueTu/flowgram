import React from 'react';

export interface SingleRunState {
  visible: boolean;
  nodeId?: string;
  canvasId?: string;
  nodeTitle?: string;
}

export interface SingleRunContextType {
  singleRunState: SingleRunState;
  setSingleRunState: (state: SingleRunState) => void;
  openSingleRun: (nodeId: string, canvasId: string, nodeTitle?: string) => void;
  closeSingleRun: () => void;
}

export const SingleRunContext = React.createContext<SingleRunContextType>({
  singleRunState: { visible: false },
  setSingleRunState: () => {},
  openSingleRun: () => {},
  closeSingleRun: () => {},
}); 