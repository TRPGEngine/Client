import React, { useContext, useState } from 'react';
import { TMemo } from '@shared/components/TMemo';
import _noop from 'lodash/noop';

interface ContextType {
  selectedPeerId: string;
  setSelectedPeerId: React.Dispatch<React.SetStateAction<string>>;
}

/**
 * 用于全局交流最新的选择的peerId的操作
 */
const SelectedPeerContext = React.createContext<ContextType>({
  selectedPeerId: undefined,
  setSelectedPeerId: _noop,
});
SelectedPeerContext.displayName = 'SelectedPeerContext';

export const SelectedPeerContextProvider: React.FC = TMemo((props) => {
  const [selectedPeerId, setSelectedPeerId] = useState(null);

  return (
    <SelectedPeerContext.Provider value={{ selectedPeerId, setSelectedPeerId }}>
      {props.children}
    </SelectedPeerContext.Provider>
  );
});
SelectedPeerContextProvider.displayName = 'SelectedPeerContextProvider';

export function useSelectedPeerContext(): ContextType {
  return useContext(SelectedPeerContext);
}
