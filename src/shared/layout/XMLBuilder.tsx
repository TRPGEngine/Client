import React, { useEffect, useState, useReducer } from 'react';
import parser, { XMLElement } from './parser/xml-parser';
import * as processor from './processor';
import _clone from 'lodash/clone';
import _isEmpty from 'lodash/isEmpty';
import _isUndefined from 'lodash/isUndefined';
import './types/__all__';

export type DefinePropsType = {
  [name: string]: any;
};
interface DefineType {
  [name: string]: (
    context: XMLBuilderContext,
    otherProps: DefinePropsType
  ) => React.FunctionComponentElement<{}>;
}

interface GlobalType {
  [name: string]: number | string | null;
}

export interface DataType {
  [name: string]: number | string | null;
}

export interface XMLBuilderState {
  defines: DefineType;
  global: GlobalType;
  data: DataType;
}

export interface XMLBuilderAction {
  type: string;
  payload: { [name: string]: any };
  [others: string]: any;
}

export interface XMLBuilderContext {
  state: XMLBuilderState;
  dispatch: React.Dispatch<XMLBuilderAction>;
}

type stateChangeHandler = (newState: React.ReducerState<any>) => void;

interface Props {
  xml: string;
  onChange?: stateChangeHandler;
}

export enum ActionType {
  UpdateData = 'update_data',
  AddDefine = 'add_define',
}

const buildReducer = (onChange?: stateChangeHandler) => {
  const XMLBuilderReducer = (
    prevState: XMLBuilderState,
    action: XMLBuilderAction
  ): any => {
    const type = action.type;
    const payload = action.payload;
    const newState = _clone(prevState);

    switch (type) {
      case ActionType.UpdateData:
        newState.data = payload;
        break;
      case ActionType.AddDefine:
        newState.defines[payload.name] = payload.componentFn;
        break;
    }

    onChange && onChange(newState);

    return newState;
  };
  return XMLBuilderReducer;
};

const XMLBuilder = (props: Props) => {
  const { xml = '', onChange } = props;
  const [layout, setLayout] = useState({});

  const initialState: XMLBuilderState = {
    defines: {},
    global: {},
    data: {},
  };
  const [state, dispatch] = useReducer(buildReducer(onChange), initialState);

  useEffect(
    () => {
      const layout = parser(xml);
      layout.type = 'root';
      console.log('layout', layout);
      setLayout(layout);
    },
    [xml]
  );

  if (_isEmpty(layout)) {
    return null;
  }

  return <div>{processor.render(layout, { state, dispatch })}</div>;
};

export default XMLBuilder;
