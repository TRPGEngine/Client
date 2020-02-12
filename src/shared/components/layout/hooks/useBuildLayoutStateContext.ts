import {
  StateChangeHandler,
  DataMap,
  XMLBuilderState,
  XMLBuilderAction,
} from '../XMLBuilder';
import { useMemo, useReducer } from 'react';
import _clone from 'lodash/clone';
import Debug from 'debug';
import { StateActionType } from '../types';
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
        const scope = action.scope ?? 'data';
        newState[scope] = payload;
        break;
      }
      case StateActionType.AddDefine:
        newState.defines[payload.name] = payload.componentFn;
        break;
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
