import React from 'react';
import Base from './Base';
import { Tabs } from 'antd';
import { XMLElement } from '../parser/xml-parser';
const TabPane = Tabs.TabPane;

export default class TTabs extends Base {
  name = 'Tabs';

  getEditView(tagName, attributes, elements: Array<XMLElement>, context) {
    const position = attributes.position || 'top';
    const childrens = elements
      .filter((el) => el.name === 'Tab')
      .map((el, index) => {
        const label = el.attributes.label || '';
        return (
          <TabPane tab={label} key={`${label}#${index}`}>
            {this.renderChildren(el.elements, context)}
          </TabPane>
        );
      });

    return <Tabs tabPosition={position}>{childrens}</Tabs>;
  }
}
