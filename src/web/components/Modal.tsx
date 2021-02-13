import React, { useCallback, useContext, useState } from 'react';
import styled from 'styled-components';
import { TMemo } from '@shared/components/TMemo';
import _isFunction from 'lodash/isFunction';
import _isNil from 'lodash/isNil';
import _last from 'lodash/last';
import _pull from 'lodash/pull';
import _isString from 'lodash/isString';
import _noop from 'lodash/noop';
import { PortalAdd, PortalRemove } from '@web/utils/portal';
import { Typography } from 'antd';
import { animated, useSpring } from 'react-spring';
import { easeQuadInOut } from 'd3-ease';
import { Iconfont } from './Iconfont';

/**
 * 新版模态框解决方案
 */

const ModalMask = styled(animated.div)`
  width: 100vw;
  height: 100vh;
  background-color: ${(props) => props.theme.color.transparent50};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalInner = styled(animated.div)`
  background-color: ${(props) => props.theme.color.graySet[7]};
  border-radius: ${(props) => props.theme.radius.standard};
  max-width: 80vw;
  max-height: 80vh;
  overflow: auto;
  position: relative;
`;

const CloseBtn = styled(Iconfont)`
  position: absolute;
  right: 10px;
  top: 14px;
  font-size: 21px;
  line-height: 21px;
  z-index: 1;
`;

const ModalContext = React.createContext<{
  closeModal: () => void;
}>({
  closeModal: _noop,
});

interface ModalProps {
  visible?: boolean;
  onChangeVisible?: (visible: boolean) => void;

  /**
   * 是否显示右上角的关闭按钮
   */
  closable?: boolean;
}
export const Modal: React.FC<ModalProps> = TMemo((props) => {
  const { visible, onChangeVisible, closable } = props;
  const [closing, setClosing] = useState(false);
  const maskStyle = useSpring({
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
    reverse: closing,
    config: {
      duration: 250,
    },
  });

  const innerStyle = useSpring({
    from: {
      marginTop: -120,
      opacity: 0,
    },
    to: {
      marginTop: 0,
      opacity: 1,
    },
    reverse: closing,
    config: {
      delay: 100,
      duration: 250,
      easing: easeQuadInOut,
    },
    onRest() {
      if (closing === true && _isFunction(onChangeVisible)) {
        onChangeVisible(false);
      }
    },
  });

  const handleClose = useCallback(() => {
    setClosing(true);
  }, []);

  const stopPropagation = useCallback((e: React.BaseSyntheticEvent) => {
    e.stopPropagation();
  }, []);

  if (visible === false) {
    return null;
  }

  return (
    <ModalMask style={maskStyle} onClick={handleClose}>
      <ModalContext.Provider value={{ closeModal: handleClose }}>
        <ModalInner style={innerStyle} onClick={stopPropagation}>
          {closable === true && (
            <CloseBtn onClick={handleClose}>&#xe70c;</CloseBtn>
          )}
          {props.children}
        </ModalInner>
      </ModalContext.Provider>
    </ModalMask>
  );
});
Modal.displayName = 'Modal';

const modelKeyStack: number[] = [];

/**
 * 关闭Modal
 */
export function closeModal(key?: number): void {
  if (_isNil(key)) {
    key = _last(modelKeyStack);
  }

  if (typeof key === 'number') {
    _pull(modelKeyStack, key);

    PortalRemove(key);
  }
}

/**
 * 打开新的Modal
 */
export function openModal(
  content: React.ReactNode,
  props?: Pick<ModalProps, 'closable'>
): number {
  const key = PortalAdd(
    <Modal
      {...props}
      visible={true}
      onChangeVisible={(visible) => {
        if (visible === false) {
          closeModal(key);
        }
      }}
    >
      {content}
    </Modal>
  );

  modelKeyStack.push(key);

  return key;
}

/**
 * 获取modal上下文
 */
export function useModalContext() {
  const { closeModal } = useContext(ModalContext);

  return { closeModal };
}

/**
 * 标准模态框包装器
 */
const ModalWrapperContainer = styled.div`
  padding: 16px;
  min-width: 300px;
  ${(props) => props.theme.mixins.desktop('min-width: 420px;')}
`;
export const ModalWrapper: React.FC<{
  title?: string;
}> = TMemo((props) => {
  const title = _isString(props.title) ? (
    <div>
      <Typography.Title
        level={4}
        style={{ textAlign: 'center', marginBottom: 16 }}
      >
        {props.title}
      </Typography.Title>
    </div>
  ) : null;

  return (
    <ModalWrapperContainer>
      {title}
      {props.children}
    </ModalWrapperContainer>
  );
});
ModalWrapper.displayName = 'ModalWrapper';
