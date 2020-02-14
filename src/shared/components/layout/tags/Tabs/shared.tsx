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

interface TagProps {
  position: string;
}
export const TagTabsShared: TagComponent<TagProps> = React.memo((props) => {
  const stateContext = useContext(LayoutStateContext);

  const position = (props.position as TabsPosition) || 'top';
  const elements = props._childrenEl;
  const childrens = useMemo(() => {
    return (elements || [])
      .filter((el) => el.name === 'Tab')
      .map((el, index) => {
        const label = el.attributes.label || '';

        return (
          <TabPane tab={label} key={`${label}#${index}`}>
            <TabPaneContainer>{render(el, stateContext)}</TabPaneContainer>
          </TabPane>
        );
      });
  }, [elements, stateContext]);

  return (
    <Tabs key={props.key} tabPosition={position}>
      {childrens}
    </Tabs>
  );
});
TagTabsShared.displayName = 'TagTabsShared';
