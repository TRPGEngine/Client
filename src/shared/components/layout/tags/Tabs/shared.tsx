import React, { useContext, useMemo } from 'react';
import { TagComponent } from '../type';
import { Tabs } from 'antd';
import { TabsPosition } from 'antd/lib/tabs';
import styled from 'styled-components';
import { LayoutStateContext } from '../../context/LayoutStateContext';
import { render } from '../../processor';

const TabPane = Tabs.TabPane;

const TabPaneContainer = styled.div`
  padding: 0 10px;
  padding-bottom: 10px;
`;

/**
 * Usage:
 * <Tabs>
 *   <Tab label="选项卡1">内容1</Tab>
 *   <Tab label="选项卡2">内容2</Tab>
 *   <Tab label="选项卡3">内容3</Tab>
 * </Tabs>
 */
interface TagProps {
  position: string;
}
export const TagTabsShared: TagComponent<TagProps> = React.memo((props) => {
  const context = useContext(LayoutStateContext);

  const position = (props.position as TabsPosition) || 'top';
  const elements = props._childrenEl;
  const children = useMemo(() => {
    return (elements || [])
      .filter((el) => el.name === 'Tab')
      .map((el, index) => {
        const label = el.attributes.label || '';

        return (
          <TabPane tab={label} key={`${label}#${index}`}>
            <TabPaneContainer>{render(el, context)}</TabPaneContainer>
          </TabPane>
        );
      });
  }, [elements, context]);

  return <Tabs tabPosition={position}>{children}</Tabs>;
});
TagTabsShared.displayName = 'TagTabsShared';
