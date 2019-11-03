import React from 'react';
import Base, { BaseTypeRow, LayoutTypeContext } from './Base';
import { Row } from 'antd';

export default class TRow extends Base {
  name = 'Row';

  getEditView({ tagName, attributes, elements, context }: LayoutTypeContext) {
    return (
      <Row key={attributes.key} {...attributes}>
        {this.renderChildren(elements, context)}
      </Row>
    );
  }

  getDetailView({ tagName, attributes, elements, context }: LayoutTypeContext) {
    return (
      <Row key={attributes.key} {...attributes}>
        {this.renderChildren(elements, context)}
      </Row>
    );
  }
}
