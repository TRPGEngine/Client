import { TMemo } from '@shared/components/TMemo';
import React, { useCallback, useContext, useMemo, useState } from 'react';

interface RightPanelContextProps {
  rightPanel: React.ReactNode;
  rightPanelName: string;
  setRightPanel: (name: string, node: React.ReactNode) => void;
}

const RightPanelContext = React.createContext<RightPanelContextProps>({
  rightPanel: null,
  rightPanelName: '',
  setRightPanel: () => {},
});

/**
 * 右边栏上下文
 * 用于设置与获取
 */
export const RightPanelContextProvider: React.FC = TMemo((props) => {
  const [rightPanel, setRightPanelNode] = useState<React.ReactNode>(null);
  const [rightPanelName, setRightPanelName] = useState<string>('');

  const setRightPanel = useCallback((name: string, node: React.ReactNode) => {
    setRightPanelName(name);
    setRightPanelNode(node);
  }, []);

  const value = useMemo(
    () => ({
      rightPanel,
      rightPanelName,
      setRightPanel,
    }),
    [rightPanel, rightPanelName]
  );

  return (
    <RightPanelContext.Provider value={value}>
      {props.children}
    </RightPanelContext.Provider>
  );
});
RightPanelContextProvider.displayName = 'RightPanelContextProvider';

export function useRightPanelContext(): RightPanelContextProps {
  return useContext(RightPanelContext);
}
