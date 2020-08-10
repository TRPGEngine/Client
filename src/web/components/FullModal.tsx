import React, { useCallback } from 'react';
import { TMemo } from '@shared/components/TMemo';
import styled from 'styled-components';
import _isFunction from 'lodash/isFunction';
import { CloseCircleOutlined } from '@ant-design/icons';
import { PortalRender } from './portal/PortalRender';

const Container = styled.div<{
  visible: boolean;
}>`
  display: ${(props) => (props.visible ? 'block' : 'none')};
  position: fixed;
  width: 100vw;
  height: 100vh;
  z-index: 100;
  background-color: ${(props) => props.theme.color.graySet[9]};
`;

const CloseBtn = styled.div`
  position: absolute;
  right: 16px;
  top: 16px;
  font-size: 26px;
  cursor: pointer;
`;

/**
 * 全屏模态框
 */
interface FullModalProps {
  visible?: boolean;
  onChangeVisible?: (visible: boolean) => void;
}
export const FullModal: React.FC<FullModalProps> = TMemo((props) => {
  const { visible = false, onChangeVisible } = props;

  const handleClose = useCallback(() => {
    _isFunction(onChangeVisible) && onChangeVisible(false);
  }, [onChangeVisible]);

  return (
    <PortalRender>
      <Container visible={visible}>
        {props.children}

        {_isFunction(onChangeVisible) && (
          <CloseBtn onClick={handleClose}>
            <CloseCircleOutlined />
          </CloseBtn>
        )}
      </Container>
    </PortalRender>
  );
});
FullModal.displayName = 'FullModal';
