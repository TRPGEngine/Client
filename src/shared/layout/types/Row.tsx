import React from 'react';
import Base, { BaseTypeRow } from './Base';
import { Row } from 'antd';

export default class TRow extends Base {
  name = 'Row';

  getEditView(tagName, attributes, elements, context) {
    return <Row>{this.renderChildren(elements, context)}</Row>;
  }

  getDetailView(tagName, attributes, elements, context) {
    return <Row>{this.renderChildren(elements, context)}</Row>;
  }
}
