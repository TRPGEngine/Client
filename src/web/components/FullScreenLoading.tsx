import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { PortalRender } from '@web/utils/portal';
import { JumpLogo } from './JumpLogo';
import styled from 'styled-components';
import { FullModal } from './FullModal';

const Container = styled.div``;

interface FullScreenLoadingProps {
  text: string;
  shouldJump: boolean;
}
export const FullScreenLoading: React.FC<FullScreenLoadingProps> = TMemo(
  (props) => {
    const text = props.text ?? '加载中...';

    return (
      <PortalRender>
        <FullModal>
          <Container>
            <JumpLogo enabled={props.shouldJump} />
            <p>{text}</p>
          </Container>
        </FullModal>
      </PortalRender>
    );
  }
);
FullScreenLoading.displayName = 'FullScreenLoading';
