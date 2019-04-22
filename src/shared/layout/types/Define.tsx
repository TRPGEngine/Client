import React, { Fragment, useReducer } from 'react';
import Base from './Base';
import {
  XMLBuilderContext,
  ActionType,
  XMLBuilderAction,
  XMLBuilderState,
  DataType,
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

  buildComponentFn(elements, context: XMLBuilderContext) {
    return (context: XMLBuilderContext): React.FunctionComponentElement<{}> => {
      const [localState, localDispatch] = useReducer(
        useDefineComponentReducer,
        { data: context.state.data, this: {} }
      );
      const wrappedContext: WrappedContextType = {
        state: localState,
        dispatch: localDispatch,
      };

      return React.createElement(
        Fragment,
        {},
        this.renderChildren(elements, wrappedContext as any) // 先直接放个any回头再修
      );
    };
  }

  getEditView(tagName, attributes, elements, context: XMLBuilderContext) {
    const name = attributes.name;

    if (!context.state.defines[name]) {
      context.dispatch({
        type: ActionType.AddDefine,
        payload: {
          name,
          componentFn: (_context: XMLBuilderContext) =>
            this.buildComponentFn(elements, _context),
        },
      });
    }

    return null;
  }
}
