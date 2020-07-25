import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  body {
    color: ${(props) => props.theme.color.textNormal};

    .ant-typography {
      color: ${(props) => props.theme.color.textNormal};
    }
  }
`;
