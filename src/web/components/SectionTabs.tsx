import { Tabs } from 'antd';
import styled from 'styled-components';

/**
 * 分端式的Tab
 */
export const SectionTabs = styled(Tabs).attrs({
  type: 'card',
})`
  &.ant-tabs.ant-tabs-card .ant-tabs-card-bar {
    border: 0;
    padding: 6px 10px;

    .ant-tabs-tab {
      background-color: transparent;
      border: 0;
      margin: 2px;
    }

    .ant-tabs-tab-active {
      border-radius: ${(props) => props.theme.radius.standard};
      background-color: ${(props) => props.theme.color.transparent90};
    }
  }
`;
