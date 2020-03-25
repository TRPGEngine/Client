import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { TMemo } from '@shared/components/TMemo';
import { fetchTRPGGameReport, ReportLogItem } from '@portal/model/trpg';
import { LogItem } from './log-item';

interface Props
  extends RouteComponentProps<{
    reportUUID: string;
  }> {}

const TRPGReportCreatePreview: React.FC<Props> = TMemo((props) => {
  const reportUUID = props.match.params.reportUUID;
  const [playerUUID, setPlayerUUID] = useState<string>('');
  const [logs, setLogs] = useState<ReportLogItem[]>([]);

  useEffect(() => {
    fetchTRPGGameReport(reportUUID).then((report) => {
      setPlayerUUID(report.content?.playerUUID);
      setLogs(report.content?.logs ?? []);
    });
  }, [reportUUID]);

  // TODO: 需要加个动画

  return (
    <div>
      {logs.map((log) => {
        return <LogItem key={log.uuid} playerUUID={playerUUID} logItem={log} />;
      })}
    </div>
  );
});
TRPGReportCreatePreview.displayName = 'TRPGReportCreatePreview';

export default TRPGReportCreatePreview;
