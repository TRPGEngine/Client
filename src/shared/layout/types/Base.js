import React from 'react';

export default class Base {
  name = 'Base';

  getEditView(element, attrs, children) {
    return React.createElement(element, attrs, children);
  }

  getDetailView(element, attrs, children) {
    return React.createElement(element, attrs, children);
  }
}
