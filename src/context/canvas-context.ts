import React from 'react';

export const CanvasContext = React.createContext<{
  canvasId: string;
}>({ canvasId: 'default' }); 