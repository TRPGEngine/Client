import {
  StateChangeHandler,
  DataMap,
  XMLBuilderState,
  XMLBuilderAction,
  XMLBuilderContext,
} from '../XMLBuilder';
import { useMemo, useReducer, useContext } from 'react';
import _clone from 'lodash/clone';
import _set from 'lodash/set';
import _get from 'lodash/get';
import _isNil from 'lodash/isNil';
import Debug from 'debug';
import { StateActionType } from '../types';
import { LayoutStateContext } from '../context/LayoutStateContext';
const debug = Debug('trpg:XMLBuilder');

const buildReducer = (onChange?: StateChangeHandler) => {
  const XMLBuilderReducer = (
    prevState: XMLBuilderState,
    action: XMLBuilderAction
  ): XMLBuilderState => {
    const type = action.type;
    const payload = action.payload;
    const newState = _clone(prevState);
    debug(`[Action] ${type}: %o`, payload);

    switch (type) {
      case StateActionType.UpdateData: {
        const data = _clone(newState.data);
        const { scope, field, value } = payload;

        if (scope === 'data') {
          // 修改data
          _set(data, field, value);
        } else if (scope === 'global') {
          // 修改global数据
          _set(newState, ['global', field].join('.'), value);
        } else {
          _set(data, [scope, field].join('.'), value);
        }

        newState.data = data;
        break;
      }
      case StateActionType.AddDefine:
        newState.defines[payload.name] = payload.component;
        break;
      case StateActionType.SetGlobal:
        newState.global[payload.name] = payload.value;
    }

    onChange && onChange(newState);

    return newState;
  };

  return XMLBuilderReducer;
};

interface LayoutStateContextConfig {
  initialData: DataMap;
  onChange: StateChangeHandler;
}
/**
 * 构建全局的布局状态上下文
 */
export const useBuildLayoutStateContext = ({
  initialData,
  onChange,
}: LayoutStateContextConfig) => {
  const initialState: XMLBuilderState = useMemo(
    () => ({
      defines: {},
      global: {},
      data: initialData ?? {},
    }),
    [initialData]
  );
  const [state, dispatch] = useReducer(buildReducer(onChange), initialState);

  return { state, dispatch };
};

/**
 * 获取最上级的上下文
 */
function getRootContext(context: XMLBuilderContext): XMLBuilderContext {
  if (!_isNil(context) && !_isNil(context.parent)) {
    return getRootContext(context.parent);
  } else {
    return context;
  }
}
function getDefineState(
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
function buildDefineReducer(name: string, parentContext: XMLBuilderContext) {
  return (
    prevState: XMLBuilderState,
    action: XMLBuilderAction
  ): XMLBuilderState => {
    const { type, payload } = action;
    debug(`[Define Action] ${type}: %o`, payload);

    switch (type) {
      case StateActionType.UpdateData: {
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

        targetContext.dispatch({
          type: StateActionType.UpdateData,
          payload: {
            scope: newScope,
            field: payload.field,
            value: payload.value,
          },
        });
        break;
      }
    }

    // 将父级的上下文转化成当前上下文
    return getDefineState(name, parentContext);
  };
}
/**
 * 构建用于Define组件的布局上下文
 * @param name use定义的唯一标识名
 */
export const useBuildLayoutDefineStateContext = (name: string) => {
  const parentContext = useContext(LayoutStateContext);
  const initialState = useMemo(() => getDefineState(name, parentContext), [
    parentContext,
  ]);
  const [_, dispatch] = useReducer(
    buildDefineReducer(name, parentContext),
    initialState
  );

  const state = getDefineState(name, parentContext);

  return { state, dispatch };
};
