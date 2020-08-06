import { Tabs } from 'antd';
import styled from 'styled-components';

/**
 * 胶囊式的Tab
 */
export const PillTabs = styled(Tabs).attrs({
  type: 'card',
})`
  &.ant-tabs.ant-tabs-card {
    color: ${(props) => props.theme.color.textNormal};

    .ant-tabs-nav {
      padding: 6px 10px;
      margin: 0;

      &::before {
        border: 0;
      }

      .ant-tabs-tab {
        background-color: transparent;
        border: 0;
        margin: 2px;
        color: ${(props) => props.theme.color.interactiveNormal};

        &.ant-tabs-tab-active,
        &:hover,
        &:active {
          border-radius: ${(props) => props.theme.radius.standard};
          background-color: ${(props) => props.theme.color.transparent90};

          .ant-tabs-tab-btn {
            color: ${(props) => props.theme.color.interactiveActive};
          }
        }
      }
    }

    .ant-tabs-content-holder {
      overflow: auto;
    }
  }
`;
