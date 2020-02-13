import React from 'react';
import { XMLBuilderContext } from '../XMLBuilder';

export const LayoutStateContext = React.createContext<XMLBuilderContext>(null);

export const LayoutStateContextProvider: React.FC<{
  state: XMLBuilderContext;
}> = React.memo((props) => {
  return (
    <LayoutStateContext.Provider value={props.state}>
      {props.children}
    </LayoutStateContext.Provider>
  );
});
LayoutStateContextProvider.displayName = 'LayoutStateContextProvider';
