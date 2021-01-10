import React, { useCallback, useRef } from 'react';
import { TMemo } from '@shared/components/TMemo';
import styled from 'styled-components';
import _isFunction from 'lodash/isFunction';
import { CloseCircleOutlined } from '@ant-design/icons';
import { useKey } from 'react-use';
import { HoverRotator } from './HoverRotator';

const Container = styled.div<{
  visible: boolean;
}>`
  opacity: ${(props) => (props.visible ? 1 : 0)};
  pointer-events: ${(props) => (props.visible ? 'auto' : 'none')};
  transition: opacity 0.2s ease-in-out;
  position: fixed;
  width: 100vw;
  height: 100vh;
  z-index: 100;
  background-color: ${(props) => props.theme.color.graySet[8]};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CloseBtn = styled.div`
  position: absolute;
  right: 32px;
  top: 32px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
`;

const CloseTip = styled.span`
  text-align: center;
  margin-top: 2px;
  font-weight: bold;
`;

/**
 * 全屏模态框
 */
interface FullModalProps {
  visible?: boolean;
  onChangeVisible?: (visible: boolean) => void;
}
export const FullModal: React.FC<FullModalProps> = TMemo((props) => {
  const { visible = true, onChangeVisible } = props;
  const ref = useRef<HTMLDivElement | null>(null);

  const handleClose = useCallback(() => {
    _isFunction(onChangeVisible) && onChangeVisible(false);
  }, [onChangeVisible]);

  useKey('Escape', handleClose, {
    event: 'keyup',
  });

  return (
    <Container visible={visible} ref={ref}>
      {props.children}

      {_isFunction(onChangeVisible) && (
        <CloseBtn onClick={handleClose}>
          <HoverRotator>
            <CloseCircleOutlined style={{ fontSize: 32 }} />
          </HoverRotator>
          <CloseTip>ESC</CloseTip>
        </CloseBtn>
      )}
    </Container>
  );
});
FullModal.displayName = 'FullModal';
