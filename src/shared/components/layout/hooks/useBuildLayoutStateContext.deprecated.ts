import { StateChangeHandler, DataMap, XMLBuilderState } from '../XMLBuilder';
import { useMemo, useReducer, useContext, useEffect } from 'react';
import _clone from 'lodash/clone';
import _set from 'lodash/set';
import _get from 'lodash/get';
import _isNil from 'lodash/isNil';
import _isFunction from 'lodash/isFunction';
import { LayoutStateContext } from '../context/LayoutStateContext';
import { buildGlobalReducer } from '../reducer/global';
import { buildDefineReducer, getDefineState } from '../reducer/define';

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
  const [state, dispatch] = useReducer(buildGlobalReducer(), initialState);

  useEffect(() => {
    _isFunction(onChange) && onChange(state);
  }, [state]);

  return { state, dispatch };
};

/**
 * 构建用于Define组件的布局上下文
 * @param name use定义的唯一标识名
 */
interface DefineStateContextProps {
  name: string;
  [other: string]: any;
}
export const useBuildLayoutDefineStateContext = (
  props: DefineStateContextProps
) => {
  const { name, ...otherProps } = props;
  const parentContext = useContext(LayoutStateContext)!;
  const initialState = useMemo(() => getDefineState(name, parentContext), [
    parentContext,
  ]);
  const [_, dispatch] = useReducer(
    buildDefineReducer(name, parentContext),
    initialState
  );

  const state = {
    ...getDefineState(name, parentContext),
    props: otherProps,
  };

  return { state, dispatch };
};
