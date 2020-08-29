import React, { useEffect } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { useThemeContext } from '@shared/context/ThemeContext';

import 'antd/dist/antd.dark.less'; // 需要确保新版的UI是异步加载的，以确保黑暗模式不会影响到旧UI

export const DarkMode: React.FC = TMemo(() => {
  const { setMode } = useThemeContext();

  useEffect(() => {
    setMode('dark');
  }, []);

  return null;
});
DarkMode.displayName = 'DarkMode';
