import React from 'react';
import processor from '../processor';

export default class Base {
  name = 'Base';

  getEditView(name, attributes, elements) {
    return React.createElement(
      name,
      attributes,
      elements.map((el) => processor.render(el, 'edit'))
    );
  }

  getDetailView(name, attributes, elements) {
    return React.createElement(
      name,
      attributes,
      elements.map((el) => processor.render(el, 'edit'))
    );
  }
}
