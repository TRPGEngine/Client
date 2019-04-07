import React from 'react';
import Base from './Base';

export default class Input extends Base {
  name = 'Input';

  getEditView(name, attributes, elements) {
    const { label } = attributes;

    return <input placeholder={label} />;
  }
}
