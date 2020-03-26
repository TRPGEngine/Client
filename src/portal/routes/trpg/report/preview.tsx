import React, { useEffect, useState, useCallback } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { TMemo } from '@shared/components/TMemo';
import { fetchTRPGGameReport, ReportLogItem } from '@portal/model/trpg';
import { PortraitContainer } from '@portal/components/PortraitContainer';
import { LogDetail } from './log-detail';
import { useNumber } from 'react-use';
import scrollTo from '@shared/utils/animated-scroll-to';
import styled from 'styled-components';
import { Divider, Typography } from 'antd';

const Container = styled(PortraitContainer)`
  padding: 10px;
  padding-bottom: 30vh; /** 永远预留30%空间防止到底 */
  overflow: hidden;
`;

const Title = styled(Typography.Title).attrs({
  level: 2,
})`
  text-align: center;
  margin-top: 0.5em;
  margin-bottom: 1em;
`;

interface Props
  extends RouteComponentProps<{
    reportUUID: string;
  }> {}

const TRPGReportPreview: React.FC<Props> = TMemo((props) => {
  const reportUUID = props.match.params.reportUUID;
  const [playerUUID, setPlayerUUID] = useState<string>('');
  const [title, setTitle] = useState('');
  const [logs, setLogs] = useState<ReportLogItem[]>([]);
  const [pos, { inc: incPos }] = useNumber(2);

  useEffect(() => {
    fetchTRPGGameReport(reportUUID).then((report) => {
      setTitle(report.title);
      setPlayerUUID(report.content?.playerUUID);
      setLogs(report.content?.logs ?? []);
    });
  }, [reportUUID]);

  const handleClick = useCallback(() => {
    incPos();
    setTimeout(() => {
      scrollTo.bottom(window.document.body, 100);
    }, 100);
  }, [incPos]);

  return (
    <Container onClick={handleClick}>
      <Title>{title}</Title>
      {logs.map((log, index) => {
        return (
          <LogDetail
            key={log.uuid}
            playerUUID={playerUUID}
            log={log}
            isShow={index <= pos}
          />
        );
      })}
      {logs.length !== 0 && pos >= logs.length - 1 && (
        <Divider>
          <Typography.Text type="secondary">剧终</Typography.Text>
        </Divider>
      )}
    </Container>
  );
});
TRPGReportPreview.displayName = 'TRPGReportPreview';

export default TRPGReportPreview;
