/**
 * 每个Define组件有个私有的上下文用于管理数据的交互
 */
import { createReducer } from '@reduxjs/toolkit';
import { XMLBuilderContext, XMLBuilderState } from '../XMLBuilder';
import _get from 'lodash/get';
import _isNil from 'lodash/isNil';
import { updateData } from './global';

/**
 * @deprecated 有无法越过的访问内存问题。使用原来的reduce操作(即useBuildLayoutStateContext的操作)
 * NOTICE: global必须复用原来的内存地址
 * 因为要让任意位置的代码在任何时刻都能获取到最新的global数据而不用更新
 * 如在Script中使用global
 */

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
  // name可能有多层级。比如ForEach中可能为list.0
  // 因此最后要用.拼接起来作为获取路径
  const currentData = _get(parentContext, ['state', 'data', name].join('.'));

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
