import React, { useReducer, useMemo, useState, useEffect } from 'react';
import parser, { XMLElement } from './parser/xml-parser';
import * as processor from './processor';
import _clone from 'lodash/clone';
import _isEmpty from 'lodash/isEmpty';
import _isUndefined from 'lodash/isUndefined';
import _isNil from 'lodash/isNil';
import './tags/__all__';
import Debug from 'debug';
const debug = Debug('trpg:XMLBuilder');
import styled from 'styled-components';
import { ILayoutTypeAttributes } from './tags/Base';
import { StateDataType, StateActionType } from './types';
import { useSize } from 'react-use';
import { LayoutWidthContextProvider } from './context/LayoutWidthContext';
import { LayoutStateContextProvider } from './context/LayoutStateContext';

export type DefinePropsType = {
  [name: string]: any;
};
interface DefineMap {
  [name: string]: (
    context: XMLBuilderContext,
    otherProps: DefinePropsType
  ) => React.FunctionComponentElement<ILayoutTypeAttributes>;
}

interface GlobalMap {
  [name: string]: StateDataType;
}

export interface DataMap {
  _name?: string;
  _avatar?: string;
  _desc?: string;
  [name: string]: StateDataType;
}

export type LayoutType = 'edit' | 'detail';

export interface XMLBuilderState {
  defines: DefineMap;
  global: GlobalMap;
  data: DataMap;
}

export interface XMLBuilderAction {
  type: string;
  payload: { [name: string]: any };
  [others: string]: any;
}

export interface XMLBuilderContext {
  state: XMLBuilderState;
  dispatch: React.Dispatch<XMLBuilderAction>;
  layoutType: LayoutType;
}

export type StateChangeHandler = (newState: XMLBuilderState) => void;

const XMLBuilderContainer = styled.div`
  text-align: left;

  pre {
    margin: 0;
  }
`;

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
        const scope = action.scope || 'data';
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

class XMLErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // 你同样可以将错误日志上报给服务器
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // 你可以自定义降级后的 UI 并渲染
      return (
        <div>
          <h2>人物卡布局解析错误</h2>
          <p>{String(this.state.error)}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

interface Props {
  xml: string;
  layoutType?: LayoutType;
  initialData?: DataMap;
  onChange?: StateChangeHandler;
}
const XMLBuilder: React.FC<Props> = (props) => {
  const { xml = '', onChange, layoutType = 'edit' } = props;
  const [error, setError] = useState<Error>(null);
  const [layout, setLayout] = useState();

  const initialState: XMLBuilderState = {
    defines: {},
    global: {},
    data: props.initialData || {},
  };
  const [state, dispatch] = useReducer(buildReducer(onChange), initialState);

  useEffect(() => {
    try {
      const layout = parser(xml);
      layout.type = 'root';
      console.log('layout', layout);
      setLayout(layout);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err);
    }
  }, [xml]);

  const LayoutDOM = useMemo(() => {
    if (!_isNil(error)) {
      return (
        <div>
          <p>XML解析出现错误:</p>
          <p>{String(error)}</p>
        </div>
      );
    }

    if (_isEmpty(layout)) {
      return null;
    }

    try {
      return processor.render(layout, { state, dispatch, layoutType });
    } catch (err) {
      console.error(err);
      setError(err);
      return null;
    }
  }, [layout, state, dispatch, layoutType, error]);

  const [XMLRender, { width }] = useSize(
    <XMLBuilderContainer>{LayoutDOM}</XMLBuilderContainer>
  );

  return (
    <XMLErrorBoundary>
      <LayoutWidthContextProvider width={width}>
        <LayoutStateContextProvider state={{ state, dispatch, layoutType }}>
          {XMLRender}
        </LayoutStateContextProvider>
      </LayoutWidthContextProvider>
    </XMLErrorBoundary>
  );
};
XMLBuilder.displayName = 'XMLBuilder';

export default XMLBuilder;
