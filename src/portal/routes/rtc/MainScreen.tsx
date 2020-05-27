import React, { useMemo } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { Me } from './Me';
import styled from 'styled-components';
import { MeController } from './MeController';
import { useRoomStateSelector } from '@src/rtc/RoomContext';
import { useSelectedPeerContext } from './SelectedPeerContext';
import { Peer } from './Peer';
import _isString from 'lodash/isString';

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.div`
  flex: 1;
  position: relative;
`;

const MainPeerContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: black;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MeContainer = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 320px;
  height: 240px;
  display: flex;
  flex-direction: initial;
  align-items: flex-end;
  justify-content: flex-end;
`;

const Toolbar = styled.div`
  border-top: ${(props) => props.theme.border.standard};
  padding: 10px;
  text-align: center;
`;

export const MainScreen: React.FC = TMemo(() => {
  const room = useRoomStateSelector((state) => state.room);
  const connected = useMemo(() => room.state === 'connected', [room.state]);
  const { selectedPeerId } = useSelectedPeerContext();

  return (
    <Container>
      <MainContent>
        {_isString(selectedPeerId) && (
          <MainPeerContainer>
            <Peer id={selectedPeerId} />
          </MainPeerContainer>
        )}

        <MeContainer>
          <Me />
        </MeContainer>
      </MainContent>

      <Toolbar>{connected && <MeController />}</Toolbar>
    </Container>
  );
});
MainScreen.displayName = 'MainScreen';
