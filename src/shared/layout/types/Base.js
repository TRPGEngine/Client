import React, { Fragment } from 'react';
import processor from '../processor';

export default class Base {
  name = 'Base';

  // 处理tag name
  parseName(name) {
    // 如果是首字母开头。视为没有做定义的内置操作。改为t-xxx的格式防止抛出命名警告
    if (typeof name === 'string' && /[A-Z]/.test(name[0])) {
      name = 't-' + name.toLowerCase();
    }

    // 如果是空字符串或者undefined。使用react的Fragment
    if (!name) {
      name = Fragment;
    }

    return name;
  }

  getEditView(name, attributes, elements) {
    name = this.parseName(name);

    return React.createElement(
      name,
      attributes,
      (elements || []).map((el) => processor.render(el, 'edit'))
    );
  }

  getDetailView(name, attributes, elements) {
    name = this.parseName(name);

    return React.createElement(
      name,
      attributes,
      elements.map((el) => processor.render(el, 'edit'))
    );
  }
}
