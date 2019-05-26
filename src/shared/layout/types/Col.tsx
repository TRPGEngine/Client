import React from 'react';
import Base, { BaseTypeRow } from './Base';
import { Col } from 'antd';

export default class TCol extends Base {
  name = 'Col';

  getEditView(name, attributes, elements, context) {
    return <Col {...attributes}>{this.renderChildren(elements, context)}</Col>;
  }
}
