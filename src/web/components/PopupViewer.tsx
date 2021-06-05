import { TMemo } from '@shared/components/TMemo';
import React, {
  useCallback,
  useContext,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { openStandaloneWindow } from './StandaloneWindow';
import _uniq from 'lodash/uniq';
import _without from 'lodash/without';
import { useValueRef } from '@shared/hooks/useValueRef';
import { t } from '@shared/i18n';
import styled from 'styled-components';

/**
 * 弹出视图容器
 */

/**
 * 已弹出视图的全局管理上下文
 */
const PopupViewerManagerContext = React.createContext({
  popupViewIdList: [] as string[],
  appendPopupViewId: (viewId: string) => {},
  removePopupViewId: (viewId: string) => {},
  hasPopupViewId: (viewId: string) => false as boolean,
});
PopupViewerManagerContext.displayName = 'PopupViewerManagerContext';

/**
 * 弹出视图的全局管理类
 */
export const PopupViewerManagerContextProvider: React.FC = TMemo((props) => {
  const [popupViewIdList, setPopupViewIdList] = useState<string[]>([]);

  const appendPopupViewId = useCallback(
    (viewId: string) => {
      setPopupViewIdList(_uniq([...popupViewIdList, viewId]));
    },
    [popupViewIdList]
  );

  const removePopupViewId = useCallback(
    (viewId: string) => {
      setPopupViewIdList(_without(popupViewIdList, viewId));
    },
    [popupViewIdList]
  );

  const hasPopupViewId = useCallback(
    (viewId: string) => {
      return popupViewIdList.includes(viewId);
    },
    [popupViewIdList]
  );

  return (
    <PopupViewerManagerContext.Provider
      value={{
        popupViewIdList,
        appendPopupViewId,
        removePopupViewId,
        hasPopupViewId,
      }}
    >
      {props.children}
    </PopupViewerManagerContext.Provider>
  );
});
PopupViewerManagerContextProvider.displayName =
  'PopupViewerManagerContextProvider';

/**
 * 获取弹出视图的全局管理类上下文
 */
export function usePopupViewerManager() {
  return useContext(PopupViewerManagerContext);
}

// --------------------------------------------

const PopupTipText = styled.div`
  text-align: center;
  position: absolute;
  top: 30%;
  left: 0;
  right: 0;
  color: ${(props) => props.theme.color.gray};
`;

/**
 * 弹出视图上下文
 */
const PopupViewerContext = React.createContext({
  popup: () => {},
  isPopup: false,
});
PopupViewerContext.displayName = 'PopupViewerContext';

type PopupViewerProps = React.PropsWithChildren<{
  viewId: string;
}>;

interface PopupViewerCallOptions {
  title?: string;
}

export interface PopupViewerRef {
  /**
   * 弹出容器内的内容
   */
  popup: (options?: PopupViewerCallOptions) => void;
}

// [viewId, {width, height} | undefined]
const popupViewerContainerCacheMap = new Map<
  string,
  React.CSSProperties | undefined
>();

/**
 * 弹出视图容器
 */
export const PopupViewer = TMemo(
  React.forwardRef<PopupViewerRef, PopupViewerProps>((props, ref) => {
    const { appendPopupViewId, removePopupViewId, hasPopupViewId } =
      usePopupViewerManager();

    const appendPopupViewIdRef = useValueRef(appendPopupViewId);
    const removePopupViewIdRef = useValueRef(removePopupViewId);
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerStyle, setContainerStyle] = useState<
      React.CSSProperties | undefined
    >(popupViewerContainerCacheMap.get(props.viewId));

    const updateContainerStyle = useCallback(
      (style: React.CSSProperties | undefined) => {
        setContainerStyle(style);
        if (style === undefined) {
          popupViewerContainerCacheMap.delete(props.viewId);
        } else {
          popupViewerContainerCacheMap.set(props.viewId, style);
        }
      },
      [setContainerStyle, props.viewId]
    );

    const isPopup = useMemo(
      () => hasPopupViewId(props.viewId),
      [hasPopupViewId, props.viewId]
    );

    const popup = useCallback(
      (options: PopupViewerCallOptions = {}) => {
        if (containerRef.current === null) {
          return;
        }

        const { height, width } = containerRef.current.getBoundingClientRect();

        updateContainerStyle({ height, width });
        appendPopupViewIdRef.current(props.viewId);

        const size = {
          height: Math.max(document.body.clientHeight / 2, height + 50), // 这里的50是StandaloneWindow的标题栏高度
          width: Math.max(document.body.clientWidth / 2, width),
        };
        openStandaloneWindow({
          title: options.title ?? '',
          body: props.children,
          options: {
            default: {
              // 居中
              x: (document.body.clientWidth - size.width) / 2,
              y: (document.body.clientHeight - size.height) / 2,
              ...size,
            },
            minHeight: (height + 50) / 2,
            minWidth: width / 2,
          },
          onClose() {
            updateContainerStyle(undefined);
            removePopupViewIdRef.current(props.viewId);
          },
        });
      },
      [props.viewId, props.children, updateContainerStyle]
    );

    useImperativeHandle(
      ref,
      () => ({
        popup,
      }),
      [popup]
    );

    return (
      <PopupViewerContext.Provider value={{ popup, isPopup }}>
        <div style={containerStyle} ref={containerRef}>
          {isPopup ? (
            <PopupTipText>{t('该视图已弹出')}</PopupTipText>
          ) : (
            props.children
          )}
        </div>
      </PopupViewerContext.Provider>
    );
  })
);
PopupViewer.displayName = 'PopupViewer';
