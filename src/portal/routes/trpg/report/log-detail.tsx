import React, { useMemo } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { ReportLogItem } from '@shared/model/trpg';
import { LogItem } from './log-item';
import { useSpring, animated } from 'react-spring';
import styled from 'styled-components';
import { ReportContextProvider } from './context';

const Container = styled(animated.div as any)`
  user-select: none;
  pointer-events: none;
  overflow: hidden;
`;

const LogDetailContainer: React.FC<{
  from: number;
}> = TMemo((props) => {
  const animationStyle = useSpring({
    from: {
      opacity: 0,
      height: 0,
      transform: `translate3d(${props.from}px,0,0)`,
    },
    to: {
      opacity: 1,
      height: 'auto' as any,
      transform: 'translate3d(0px,0,0)',
    },
  });

  return <Container style={{ ...animationStyle }}>{props.children}</Container>;
});

interface Props {
  playerUUID: string;
  log: ReportLogItem;
  isShow: boolean;
}
export const LogDetail: React.FC<Props> = TMemo((props) => {
  const { playerUUID, log, isShow } = props;
  const from = playerUUID === log.sender_uuid ? 20 : -20;

  const logNode = useMemo(
    () => (
      <LogDetailContainer from={from}>
        <LogItem playerUUID={playerUUID} logItem={log} />
      </LogDetailContainer>
    ),
    [playerUUID, log, from]
  );

  return (
    <ReportContextProvider>{isShow ? logNode : null}</ReportContextProvider>
  );
});
