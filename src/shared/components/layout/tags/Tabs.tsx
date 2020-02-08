import React from 'react';
import Base, { LayoutTypeContext } from './Base';
import { Tabs } from 'antd';
import { TabsPosition } from 'antd/lib/tabs';
import styled from 'styled-components';
const TabPane = Tabs.TabPane;

const TabPaneContainer = styled.div`
  padding: 0 10px;
  padding-bottom: 10px;
`;

export default class TTabs extends Base {
  name = 'Tabs';

  getEditView({ tagName, attributes, elements, context }: LayoutTypeContext) {
    const position = (attributes.position as TabsPosition) || 'top';
    const childrens = (elements || [])
      .filter((el) => el.name === 'Tab')
      .map((el, index) => {
        const label = el.attributes.label || '';
        return (
          <TabPane tab={label} key={`${label}#${index}`}>
            <TabPaneContainer>
              {this.renderChildren(el.elements, context)}
            </TabPaneContainer>
          </TabPane>
        );
      });

    return (
      <Tabs key={attributes.key} tabPosition={position}>
        {childrens}
      </Tabs>
    );
  }
}
