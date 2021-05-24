import React, {
  useMemo,
  useState,
  useEffect,
  useCallback,
  useImperativeHandle,
} from 'react';
import parser, { XMLElement } from './parser/xml-parser';
import * as processor from './processor';
import _isEmpty from 'lodash/isEmpty';
import _isUndefined from 'lodash/isUndefined';
import _isNil from 'lodash/isNil';
import _isFunction from 'lodash/isFunction';
import './tags/__all__';
import styled from 'styled-components';
import { StateDataType, StateActionType, preRenderTags } from './types';
import { useSize } from 'react-use';
import { LayoutWidthContextProvider } from './context/LayoutWidthContext';
import { LayoutStateContextProvider } from './context/LayoutStateContext';
import { useBuildLayoutStateContext } from './hooks/useBuildLayoutStateContext';
import { iterativeConfigKey } from './parser/key';
import { TMemo } from '../TMemo';
import { LayoutNode } from './processor/LayoutNode';
import {
  getASTObjectWithoutTagName,
  getASTObjectWithTagName,
} from './parser/tagname-helper';

/**
 * XML布局需求:
 * name必须全局唯一
 * 需要版本号
 * 以Template组件作为统一包装(不强求)
 */

export type DefinePropsType = {
  [name: string]: any;
};
interface DefineMap {
  [name: string]: React.ComponentType<DefinePropsType>;
}

export interface DataMap {
  _name?: string;
  _avatar?: string;
  _desc?: string;
  [name: string]: StateDataType | DataMap; // 可以嵌套
}

export type LayoutType = 'edit' | 'detail';

export interface XMLBuilderState {
  defines: DefineMap;
  data: DataMap;
  global: DataMap; // 全局变量
}

export interface XMLBuilderAction {
  type: StateActionType;
  payload: { [name: string]: any };
  [others: string]: any;
}

export interface XMLBuilderContext {
  state: XMLBuilderState;
  dispatch: React.Dispatch<XMLBuilderAction>;
  layoutType: LayoutType;
  parent?: XMLBuilderContext;
}

export type StateChangeHandler = (newState: XMLBuilderState) => void;

const XMLBuilderContainer = styled.div`
  text-align: left;
  width: 100%;

  pre {
    margin: 0;
  }

  code {
    padding: 0.2em 0.4em;
    margin: 0;
    font-size: 85%;
    background-color: rgba(27, 31, 35, 0.05);
    border-radius: 3px;
  }
`;

export class XMLErrorBoundary extends React.Component {
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

/**
 * 容器与上下文抽象
 */
export const LayoutProviderContainer: React.FC<{
  style?: React.CSSProperties;
  layoutType?: LayoutType;
  initialData?: DataMap;
  onChange?: StateChangeHandler;
  builderRef: React.Ref<XMLBuilderRef>;
}> = TMemo((props) => {
  const { style, layoutType = 'edit', builderRef } = props;
  const handleChange = useCallback(
    (newState: XMLBuilderState) => {
      _isFunction(props.onChange) && props.onChange(newState);
    },
    [props.onChange]
  );
  const { state, dispatch } = useBuildLayoutStateContext({
    initialData: props.initialData ?? {},
    onChange: handleChange,
  });

  const context = useMemo(() => ({ state, dispatch, layoutType }), [
    state,
    dispatch,
    layoutType,
  ]);

  const [XMLRender, { width }] = useSize(
    <XMLBuilderContainer style={style}>{props.children}</XMLBuilderContainer>
  );

  useImperativeHandle(
    builderRef,
    () => ({
      updateAllData: (data) => {
        dispatch({
          type: StateActionType.UpdateAllData,
          payload: {
            data,
          },
        });
      },
    }),
    []
  );

  return (
    <LayoutWidthContextProvider width={width}>
      <LayoutStateContextProvider state={context}>
        {XMLRender}
      </LayoutStateContextProvider>
    </LayoutWidthContextProvider>
  );
});
LayoutProviderContainer.displayName = 'LayoutProvider';

interface XMLBuilderProps {
  xml: string;
  layoutType?: LayoutType;
  initialData?: DataMap;
  onChange?: StateChangeHandler;
}
export interface XMLBuilderRef {
  /**
   * 更新所有数据
   */
  updateAllData: (data: Record<string, any>) => void;
}
export const XMLBuilder = TMemo(
  React.forwardRef<XMLBuilderRef, XMLBuilderProps>((props, ref) => {
    const { xml = '', onChange, layoutType = 'edit' } = props;
    const [error, setError] = useState<Error | null>(null);
    const [layout, setLayout] = useState<XMLElement>();

    useEffect(() => {
      try {
        const ast = parser(xml);
        ast.type = 'root';
        iterativeConfigKey(ast);
        console.log('layout', ast);

        // 渲染分两步
        // 1. 渲染预加载组件
        setLayout(getASTObjectWithTagName(ast, preRenderTags));
        requestAnimationFrame(() => {
          // 2. 待渲染完毕后渲染除了预加载组件以外的所有组件
          setLayout(getASTObjectWithoutTagName(ast, preRenderTags));
        });

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
        return <LayoutNode node={layout!} />;
      } catch (err) {
        console.error(err);
        setError(err);
        return null;
      }
    }, [layout, error]);

    return (
      <XMLErrorBoundary>
        <LayoutProviderContainer builderRef={ref}>
          {LayoutDOM}
        </LayoutProviderContainer>
      </XMLErrorBoundary>
    );
  })
);
XMLBuilder.displayName = 'XMLBuilder';

export default XMLBuilder;
