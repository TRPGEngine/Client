import React, { useCallback } from 'react';
import styled from 'styled-components';
import { TMemo } from '@shared/components/TMemo';
import _isFunction from 'lodash/isFunction';

const ModalMask = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: ${(props) => props.theme.color.transparent80};
`;

const ModalInner = styled.div`
  background-color: white;
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
