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

  html body.trpg-engine {
    /* 使用这些容器来增加权重 */
    .ant-dropdown-menu {
      background-color: ${(props) => props.theme.color.graySet[8]};
    }

    .ant-select-dropdown {
      background-color: ${(props) => props.theme.color.graySet[8]};

      .ant-select-item-option-selected:not(.ant-select-item-option-disabled) {
        background-color: ${(props) => props.theme.color.graySet[6]};
      }
    }

    /* .ant-input, .ant-input-password, .ant-select-selector {
      border-color: ${(props) => props.theme.color.graySet[9]};
    } */

    .ant-select-selector {
      background-color: ${(props) => props.theme.color.graySet[6]} !important;
    }

    .ant-select-clear {
      background-color: ${(props) => props.theme.color.graySet[6]};
    }

    .ant-collapse-content {
      background-color: ${(props) => props.theme.color.graySet[7]} !important;
    }

    .ant-empty-description {
      user-select: none;
    }

    .ant-table {
      background-color: rgba(0, 0, 0, 0.5);
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
