import React from 'react';
import Base, { BaseTypeRow, LayoutTypeContext } from './Base';
import { Col } from 'antd';

export default class TCol extends Base {
  name = 'Col';

  getEditView({ attributes, elements, context }: LayoutTypeContext) {
    return <Col {...attributes}>{this.renderChildren(elements, context)}</Col>;
  }
}
