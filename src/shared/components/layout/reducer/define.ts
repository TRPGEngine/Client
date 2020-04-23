/**
 * 每个Define组件有个私有的上下文用于管理数据的交互
 */
import { createReducer } from '@reduxjs/toolkit';
import { XMLBuilderContext, XMLBuilderState } from '../XMLBuilder';
import _get from 'lodash/get';
import _isNil from 'lodash/isNil';
import { updateData } from './global';

/**
 * 获取最上级的上下文
 */
export function getRootContext(context: XMLBuilderContext): XMLBuilderContext {
  if (!_isNil(context) && !_isNil(context.parent)) {
    return getRootContext(context.parent);
  } else {
    return context;
  }
}

/**
 * 将父级的上下文转化成当前上下文
 */
export function getDefineState(
  name: string,
  parentContext: XMLBuilderContext
): XMLBuilderState {
  const currentData = _get(parentContext, ['state', 'data', name]);

  return {
    defines: parentContext.state.defines,
    data: {
      ...(typeof currentData === 'object' ? currentData : {}),
      parent: parentContext.state.data,
      root: getRootContext(parentContext).state.data,
    },
    global: parentContext.state.global,
  };
}

export function buildDefineReducer(
  name: string,
  parentContext: XMLBuilderContext
) {
  const initialState = getDefineState(name, parentContext);
  return createReducer(initialState, (builder) => {
    builder.addCase(updateData, (state, { payload }) => {
      const scope = payload.scope ?? 'data';

      // 向上传递
      let newScope = scope;
      let targetContext = parentContext;
      if (scope === 'data') {
        // 修改当前数据
        newScope = name;
      } else if (scope === 'parent') {
        // 修改父级数据
        newScope = 'data';
      } else if (scope === 'root') {
        // 修改全局数据，层层传递
        newScope = 'data';
        targetContext = getRootContext(parentContext);
      }

      targetContext.dispatch(
        updateData({
          scope: newScope,
          field: payload.field,
          value: payload.value,
        })
      );

      state = getDefineState(name, parentContext);
    });
  });
}
