import * as React from 'react';
import Base from './Base';
import { Input } from 'antd';

export default class TInput extends Base {
  name = 'Input';

  getEditView(name, attributes, elements) {
    const { label } = attributes;

    return <Input placeholder={label} />;
  }
}
