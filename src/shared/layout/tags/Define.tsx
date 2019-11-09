import React, { Fragment } from 'react';
import Base, { LayoutTypeContext } from './Base';
import {
  XMLBuilderContext,
  ActionType,
  XMLBuilderAction,
  XMLBuilderState,
  DataType,
  DefinePropsType,
} from '../XMLBuilder';
import _set from 'lodash/set';

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
  props: DataType;
};

type WrappedContextType = {
  state: WrappedStateType;
  dispatch: React.Dispatch<XMLBuilderAction>;
};

type DefineConstructorProps = {
  elements: any[];
  attributes: DefinePropsType;
  context: XMLBuilderContext;
  renderChildrenFn: any;
};

let globalInstanceId = 0;

class DefineConstructor extends React.Component<DefineConstructorProps> {
  instanceId: number;

  componentDidMount() {
    this.instanceId = ++globalInstanceId;
  }

  getPrivateScopeName() {
    return `sub-${this.instanceId}`;
  }

  render() {
    const props = this.props;
    const { elements, context, attributes, renderChildrenFn } = props;

    const wrappedContext: WrappedContextType = {
      state: {
        ...context.state,
        props: {
          ...attributes,
          ...context.state[this.getPrivateScopeName()],
        },
      },
      dispatch: (action: XMLBuilderAction) => {
        const { type } = action;
        switch (type) {
          case ActionType.UpdateData:
            // 如果是更新变量。需要在该实例的下子对象进行修改以保证不会影响到全局
            if (action.scope === 'props') {
              action.scope = this.getPrivateScopeName();
            }
            context.dispatch(action);
            break;
          default:
            context.dispatch(action);
            break;
        }
      },
    };

    return React.createElement(
      Fragment,
      { key: attributes.key },
      renderChildrenFn(elements, wrappedContext as any) // 先直接放个any回头再修
    );
  }
}

/**
 * 定义的子组件名
 */
export default class TDefine extends Base {
  name = 'Define';

  buildComponentFn(
    elements,
    context: XMLBuilderContext,
    otherProps: DefinePropsType = {}
  ) {
    // wrappedContext 是一个局部的小型作用域
    return React.createElement(DefineConstructor, {
      key: otherProps.key,
      elements,
      attributes: otherProps,
      context,
      renderChildrenFn: (elements, wrappedContext) =>
        this.renderChildren(elements, wrappedContext),
    });
  }

  getEditView({ tagName, attributes, elements, context }: LayoutTypeContext) {
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
