import React, { useState, useContext, useMemo } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { ThemeMode, getStyledTheme } from '@shared/utils/theme';
import { ThemeProvider, ThemeContext } from 'styled-components';

interface ThemeModeContextProps {
  mode: ThemeMode;
  setMode: (newMode: ThemeMode) => void;
}

const ThemeModeContext = React.createContext<ThemeModeContextProps>({
  mode: 'light',
  setMode: () => {},
});
ThemeModeContext.displayName = 'ThemeModeContext';

/**
 * 主题
 */
export const ThemeContextProvider = TMemo((props) => {
  const [mode, setMode] = useState<ThemeMode>('light');

  const theme = useMemo(() => getStyledTheme(mode), [mode]);

  return (
    <ThemeModeContext.Provider value={{ mode, setMode }}>
      <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
    </ThemeModeContext.Provider>
  );
});
ThemeContextProvider.displayName = 'ThemeContextProvider';

/**
 * 主题相关上下文
 */
export function useThemeContext() {
  const { mode, setMode } = useContext(ThemeModeContext);
  const theme = useContext(ThemeContext);

  return { mode, setMode, theme };
}
