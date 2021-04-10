import React, { useCallback } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { useKey } from 'react-use';
import { useTRPGDispatch } from '@redux/hooks/useTRPGSelector';
import { switchMenuPannel } from '@redux/actions/ui';

/**
 * 用于注册全局的快捷键
 */
export const GlobalShortcuts: React.FC = TMemo((props) => {
  const dispatch = useTRPGDispatch();
  const handleSwitch = useCallback(
    (e: KeyboardEvent, index: number) => {
      if (e.altKey) {
        dispatch(switchMenuPannel(index));
      }
    },
    [dispatch]
  );
  useKey('1', (e) => handleSwitch(e, 0));
  useKey('2', (e) => handleSwitch(e, 1));
  useKey('3', (e) => handleSwitch(e, 2));
  useKey('4', (e) => handleSwitch(e, 3));

  return null;
});
GlobalShortcuts.displayName = 'GlobalShortcuts';
