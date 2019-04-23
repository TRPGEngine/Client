import React, { Fragment, useReducer } from 'react';
import Base from './Base';
import {
  XMLBuilderContext,
  ActionType,
  XMLBuilderAction,
  XMLBuilderState,
  DataType,
  DefinePropsType,
} from '../XMLBuilder';

const useDefineComponentReducer = (
  prevState: WrappedStateType,
  action: XMLBuilderAction
) => {
  // TODO: 局部context dispatch方法待实现
  console.log(prevState, action);

  return prevState;
};

type WrappedStateType = {
  data: DataType;
  this: DataType;
};

type WrappedContextType = {
  state: WrappedStateType;
  dispatch: React.Dispatch<XMLBuilderAction>;
};

export default class TDefine extends Base {
  name = 'Define';

  buildComponentFn(
    elements,
    context: XMLBuilderContext,
    otherProps: DefinePropsType = {}
  ): React.FunctionComponentElement<{}> {
    const wrappedContext: WrappedContextType = {
      state: {
        ...context.state,
        this: otherProps,
      },
      dispatch: context.dispatch,
    };

    console.log('otherProps', otherProps);

    return React.createElement(
      Fragment,
      { key: otherProps.key },
      this.renderChildren(elements, wrappedContext as any) // 先直接放个any回头再修
    );
  }

  getEditView(tagName, attributes, elements, context: XMLBuilderContext) {
    const name = attributes.name;

    if (!context.state.defines[name]) {
      context.dispatch({
        type: ActionType.AddDefine,
        payload: {
          name,
          componentFn: (
            _context: XMLBuilderContext,
            otherProps: DefinePropsType
          ) => this.buildComponentFn(elements, _context, otherProps),
        },
      });
    }

    return null;
  }
}
