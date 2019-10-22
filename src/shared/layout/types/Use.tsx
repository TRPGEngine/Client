import React from 'react';
import Base, { BaseTypeRow, ILayoutTypeAttributes, ILayoutType } from './Base';
import { Row } from 'antd';
import { XMLBuilderContext } from '../XMLBuilder';
import { XMLElementAttributes } from '../parser/xml-parser';

interface Attributes extends ILayoutTypeAttributes {
  define: string;
  [other: string]: any;
}
export default class TUse extends Base implements ILayoutType<Attributes> {
  name = 'Use';

  getEditView(
    tagName,
    attributes: Attributes,
    elements,
    context: XMLBuilderContext
  ) {
    const { state } = context;
    const defines = state.defines;
    const { define, ...otherProps } = attributes;

    const componentFn = defines[define];
    if (componentFn) {
      return componentFn(context, otherProps);
    } else {
      return null;
    }
  }
}
