import React, { Fragment } from 'react';
import Base from './Base';
import { XMLBuilderContext } from '../XMLBuilder';

export default class TDefine extends Base {
  name = 'Define';

  getEditView(name, attributes, elements, context: XMLBuilderContext) {
    const attrName = attributes.name;

    if (context.defines[attrName]) {
      // TODO: 需要处理里面的逻辑, 暂时先弄个不处理数据的
      context.defines[attrName] = (props): any => {
        return React.createElement(
          Fragment,
          {},
          this.renderChildren(elements, context)
        );
      };
    }

    return null;
  }
}
