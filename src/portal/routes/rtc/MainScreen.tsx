import React, { useMemo } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { Me } from './Me';
import styled from 'styled-components';
import { MeController } from './MeController';
import { useRoomStateSelector } from '@src/rtc/RoomContext';

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.div`
  flex: 1;
  position: relative;
`;

const MeContainer = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
`;

const Toolbar = styled.div`
  border-top: ${(props) => props.theme.border.standard};
  padding: 10px;
  text-align: center;
`;

export const MainScreen: React.FC = TMemo(() => {
  const room = useRoomStateSelector((state) => state.room);
  const connected = useMemo(() => room.state === 'connected', [room.state]);

  return (
    <Container>
      <MainContent>
        {/* Here should render somthing */}

        <MeContainer>
          <Me />
        </MeContainer>
      </MainContent>

      <Toolbar>{connected && <MeController />}</Toolbar>
    </Container>
  );
});
MainScreen.displayName = 'MainScreen';
