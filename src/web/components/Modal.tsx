import React, { useCallback } from 'react';
import styled from 'styled-components';
import { TMemo } from '@shared/components/TMemo';
import _isFunction from 'lodash/isFunction';
import _isNil from 'lodash/isNil';
import _last from 'lodash/last';
import _pull from 'lodash/pull';
import { PortalAdd, PortalRemove } from '@web/utils/portal';

/**
 * 新版模态框解决方案
 */

const ModalMask = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: ${(props) => props.theme.color.transparent70};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalInner = styled.div`
  background-color: ${(props) => props.theme.color.graySet[7]};
  border-radius: ${(props) => props.theme.radius.standard};
`;

interface ModalProps {
  visible?: boolean;
  onChangeVisible?: (visible: boolean) => void;
}
export const Modal: React.FC<ModalProps> = TMemo((props) => {
  const { visible, onChangeVisible } = props;

  const handleClose = useCallback(() => {
    if (_isFunction(onChangeVisible)) {
      onChangeVisible(false);
    }
  }, [onChangeVisible]);

  const stopPropagation = useCallback((e: React.BaseSyntheticEvent) => {
    e.stopPropagation();
  }, []);

  if (visible === false) {
    return null;
  }

  return (
    <ModalMask onClick={handleClose}>
      <ModalInner onClick={stopPropagation}>{props.children}</ModalInner>
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
export function openModal(content: React.ReactNode): number {
  const key = PortalAdd(
    <Modal
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
 * 标准模态框包装器
 */
export const ModalWrapper = styled.div`
  padding: 16px;
  min-width: 440px;
`;
