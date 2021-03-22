import XMLBuilder from '@shared/components/layout/XMLBuilder';
import { getStyledTheme } from '@shared/utils/theme';
import React from 'react';
import { ThemeProvider } from 'styled-components';

/**
 * XMLBuilder的单元测试容器
 */
export const XMLBuilderTester: React.FC<PickFunctionComponentProps<
  typeof XMLBuilder
>> = (props) => {
  return (
    <ThemeProvider theme={getStyledTheme('light')}>
      <XMLBuilder {...props} />
    </ThemeProvider>
  );
};
