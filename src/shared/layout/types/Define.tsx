import React, { Fragment } from 'react';
import Base from './Base';
import { XMLBuilderContext } from '../XMLBuilder';

export default class TDefine extends Base {
  name = 'Define';

  getEditView(tagName, attributes, elements, context: React.Context<XMLBuilderContext>) {
    const name = attributes.name;

    // if (context.defines[name]) {
    //   // TODO: 需要处理里面的逻辑, 暂时先弄个不处理数据的
    //   context.defines[name] = (props): any => {
    //     return React.createElement(
    //       Fragment,
    //       {},
    //       this.renderChildren(elements, context)
    //     );
    //   };
    // }

    return null;
  }
}
