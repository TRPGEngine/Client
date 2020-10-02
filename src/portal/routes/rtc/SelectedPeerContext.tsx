import React, { useContext, useState } from 'react';
import { TMemo } from '@shared/components/TMemo';
import _noop from 'lodash/noop';

interface ContextType {
  selectedPeerId: string | null;
  setSelectedPeerId: React.Dispatch<React.SetStateAction<string | null>>;
}

/**
 * 用于全局交流最新的选择的peerId的操作
 */
const SelectedPeerContext = React.createContext<ContextType>({
  selectedPeerId: null,
  setSelectedPeerId: _noop,
});
SelectedPeerContext.displayName = 'SelectedPeerContext';

export const SelectedPeerContextProvider: React.FC = TMemo((props) => {
  const [selectedPeerId, setSelectedPeerId] = useState<string | null>(null);

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
