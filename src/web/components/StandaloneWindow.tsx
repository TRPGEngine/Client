import React, { ReactNode, useMemo } from 'react';
import { Rnd, Props as RndProps } from 'react-rnd';
import ReactDOM from 'react-dom';
import _isFunction from 'lodash/isFunction';
import _isNumber from 'lodash/isNumber';
import styled from 'styled-components';
import styledTheme from '@shared/utils/theme';
import { useWindowSize } from 'react-use';
import Webview from './Webview';
import { getUserJWT } from '@shared/utils/jwt-helper';
import { getPortalUrl } from '@shared/utils/string-helper';
import _isString from 'lodash/isString';

export interface StandaloneWindowConfig {
  options?: RndProps;
  title?: string;
  body: ReactNode;
  onMinimize?: () => void;
  onClose?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const Container = styled.div`
  pointer-events: none;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;

  > div {
    pointer-events: auto;
  }
`;

const WindowContainer = styled.div`
  box-shadow: ${styledTheme.boxShadow.normal};
  border-radius: ${styledTheme.radius.standard};
  background-color: white;
  color: ${styledTheme.color['cod-gray']};
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  > .window-container-title {
    display: flex;
    justify-content: space-between;
    padding: 10px 6px;
    font-size: 18px;
    border-bottom: ${styledTheme.border.standard};
    cursor: move;

    > .window-container-title-action {
      display: flex;

      > div {
        padding: 0 4px;
        cursor: pointer;
      }
    }
  }

  > .window-container-body {
    flex: 1;
    overflow-x: hidden;
    overflow-y: auto;
  }
`;

type WindowContainerProps = Pick<
  StandaloneWindowConfig,
  'title' | 'onMinimize' | 'onClose'
>;
const Window: React.FC<WindowContainerProps> = React.memo((props) => {
  return (
    <WindowContainer>
      <div className="window-container-title">
        <span>{props.title}</span>
        <div className="window-container-title-action">
          {/* <div title="最小化" onClick={props.onMinimize}>
            <i className="iconfont">&#xe657;</i>
          </div> */}
          <div title="关闭" onClick={props.onClose}>
            <i className="iconfont">&#xe70c;</i>
          </div>
        </div>
      </div>
      <div className="window-container-body">{props.children}</div>
    </WindowContainer>
  );
});

/**
 * 独立窗口
 */
let currentWindowNum = 0;
const StandaloneWindow: React.FC<StandaloneWindowConfig> & {
  open?: (config: StandaloneWindowConfig) => void;
} = React.memo((props) => {
  const { width, height } = useWindowSize();

  const defaultPos = useMemo(() => {
    const defaultPos = props.options!.default!;

    return {
      ...defaultPos,
      x: width / 2 + currentWindowNum * 40,
      y: _isNumber(defaultPos?.height)
        ? height - defaultPos!.height
        : height / 2,
    };
  }, []);

  return (
    <Container>
      <Rnd
        dragHandleClassName="window-container-title"
        {...props.options}
        default={defaultPos}
      >
        <Window title={props.title} onClose={props.onClose}>
          {props.body}
        </Window>
      </Rnd>
    </Container>
  );
});
StandaloneWindow.displayName = 'StandaloneWindow';
StandaloneWindow.defaultProps = {
  options: {
    default: {
      x: 0,
      y: 0,
      width: 360,
      height: 420,
    },
    minWidth: 180,
    minHeight: 210,
  },
  title: '新窗口',
};

// 打开操作
StandaloneWindow.open = (config) => {
  const div = document.createElement('div');
  document.body.appendChild(div);

  function destroy() {
    const unmountResult = ReactDOM.unmountComponentAtNode(div);
    if (unmountResult && div.parentNode) {
      div.parentNode.removeChild(div);
      currentWindowNum--;
    }
  }

  currentWindowNum++;
  ReactDOM.render(
    <StandaloneWindow
      {...config}
      onClose={(e) => {
        e.stopPropagation();
        destroy();
        _isFunction(config.onClose) && config.onClose(e);
      }}
    />,
    div
  );
};

export default StandaloneWindow;

/**
 * 打开一个portal窗口
 */
export async function openPortalWindow(
  portalUrl: string,
  options?: Omit<StandaloneWindowConfig, 'body'>
) {
  const jwt = await getUserJWT(); // 检查WebToken
  // 将获取到的当前用户的WebToken设置到jwt上。jwt为portal需要使用的localStorage
  if (_isString(jwt)) {
    window.localStorage.setItem('jwt', jwt);
  }
  const node = React.createElement(Webview, { src: getPortalUrl(portalUrl) });

  StandaloneWindow.open!({
    ...options,
    body: node,
  });
}
