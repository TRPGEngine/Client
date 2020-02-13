import React from 'react';
import Base, {
  ILayoutTypeAttributes,
  ILayoutType,
  LayoutTypeContext,
} from './Base';

interface Attr extends ILayoutTypeAttributes {
  define: string;
  [other: string]: any;
}
export default class TUse extends Base implements ILayoutType<Attr> {
  name = 'Use';

  getEditView({
    tagName,
    attributes,
    elements,
    context,
  }: LayoutTypeContext<Attr>) {
    // 弃用
    // const { state } = context;
    // const defines = state.defines;
    // const { define, ...otherProps } = attributes;

    // const componentFn = defines[define];
    // if (componentFn) {
    //   return componentFn(context, otherProps);
    // } else {
    //   return null;
    // }

    return null;
  }
}
