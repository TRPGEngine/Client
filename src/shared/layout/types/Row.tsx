import React from 'react';
import Base, { BaseTypeRow } from './Base';
import { Row } from 'antd';

export default class TRow extends Base {
  name = 'Row';

  getEditView(name, attributes, elements, context) {
    return <Row>{this.renderChildren(elements, context)}</Row>;
  }
}
