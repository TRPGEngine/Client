import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  body {
    color: ${(props) => props.theme.color.textNormal};

    .ant-typography {
      color: ${(props) => props.theme.color.textNormal};
    }
  }

  h1, h2, h3, h4, h5 {
    color: ${(props) => props.theme.color.textNormal};
  }

  /* antd 黑夜模式下样式 */
  .app.new-ui {
    .ant-input, .ant-select-selector {
      border-color: ${(props) => props.theme.color.graySet[6]};
    }
  }

  /* 新版滚动条 */
  ::-webkit-scrollbar {
    width: 16px;
    height: 16px;
  }

  ::-webkit-scrollbar-corner {
    background-color: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #202225;
    border-color: transparent;
    background-clip: padding-box;
    border-width: 4px;
    border-style: solid;
    border-radius: 8px;

    &:hover {
      background-color: #202225;
    }
  }

  ::-webkit-scrollbar-track {
    background-color: #2f3136;
    border-color: transparent;
    background-clip: padding-box;
    border-width: 4px;
    border-style: solid;
    border-radius: 8px;
  }
`;
