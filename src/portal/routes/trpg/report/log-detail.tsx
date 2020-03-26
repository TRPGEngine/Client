import React, { useMemo } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { ReportLogItem } from '@portal/model/trpg';
import { LogItem } from './log-item';
import { useSpring, animated } from 'react-spring';
import styled from 'styled-components';

const Container = styled(animated.div)`
  user-select: none;
  pointer-events: none;
`;

interface Props {
  playerUUID: string;
  log: ReportLogItem;
  isShow: boolean;
}
export const LogDetail: React.FC<Props> = TMemo((props) => {
  const { playerUUID, log, isShow } = props;
  const from = playerUUID === log.sender_uuid ? 20 : -20;
  const animationStyle = useSpring({
    from: {
      opacity: 0,
      height: 0,
      transform: `translate3d(${from}px,0,0)`,
    },
    to: {
      opacity: isShow ? 1 : 0,
      height: isShow ? 'auto' : 0,
      transform: `translate3d(${isShow ? 0 : from}px,0,0)`,
    },
  });

  const logNode = useMemo(
    () => (
      <Container style={{ ...animationStyle }}>
        <LogItem playerUUID={playerUUID} logItem={log} />
      </Container>
    ),
    [playerUUID, log]
  );

  return logNode;
});
