import React from 'react';

export const LayoutWidthContext = React.createContext(0);
LayoutWidthContext.displayName = 'LayoutWidthContext';

interface LayoutWidthContextProviderProps {
  width: number;
}
export const LayoutWidthContextProvider: React.FC<LayoutWidthContextProviderProps> =
  React.memo((props) => {
    return (
      <LayoutWidthContext.Provider value={props.width}>
        {props.children}
      </LayoutWidthContext.Provider>
    );
  });
LayoutWidthContextProvider.displayName = 'LayoutWidthContextProvider';
