import React from 'react';
import Base, { BaseTypeRow } from './Base';
import { Row } from 'antd';

export default class TRow extends Base {
  name = 'Define';

  getEditView(name, attributes, elements, context) {
    console.log('context', context);
    return null;
  }
}
