import React from 'react';
import ReactDom from 'react-dom';
import { ThemeProvider } from 'styled-components';
import styledTheme from '@shared/utils/theme';
import ActorEditor from './actor-editor';

ReactDom.render(
  <ThemeProvider theme={styledTheme}>
    <ActorEditor />
  </ThemeProvider>,
  document.querySelector('#app')
);
