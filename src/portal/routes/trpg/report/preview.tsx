import React, {
  Fragment,
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { TMemo } from '@shared/components/TMemo';
import { fetchTRPGGameReport, ReportLogItem } from '@portal/model/trpg';
import { PortraitContainer } from '@portal/components/PortraitContainer';
import { LogDetail } from './log-detail';
import { useNumber } from 'react-use';
import scrollTo from '@shared/utils/animated-scroll-to';
import styled from 'styled-components';
import { Divider, Typography } from 'antd';
import { QRCode } from '@portal/components/QRCode';
import Loading from '@portal/components/Loading';

const Container = styled(PortraitContainer)`
  padding: 10px;
  padding-bottom: 30vh; /** 永远预留30%空间防止到底 */
  overflow-x: hidden;
  overflow-y: auto;
  height: 100vh;
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchTRPGGameReport(reportUUID).then((report) => {
      setTitle(report.title);
      setPlayerUUID(report.content?.playerUUID);
      setLogs(report.content?.logs ?? []);
      setLoading(false);
    });
  }, [reportUUID]);

  const containerRef = useRef<HTMLDivElement>(null);
  const handleClick = useCallback(() => {
    incPos();
    setTimeout(() => {
      if (containerRef.current) {
        scrollTo.bottom(containerRef.current, 100);
      }
    }, 100);
  }, [incPos]);

  const share = useMemo(() => {
    const src = window.location.href;

    return (
      <div style={{ textAlign: 'center' }}>
        <p>扫一扫二维码分享:</p>
        <QRCode value={src} />
        <div>或复制永久链接</div>
        <Typography.Text copyable={{ text: src }}>
          <a href={src} target="_blank" rel="noreferrer">
            {src}
          </a>
        </Typography.Text>

        <p>或者在手机端直接分享本页面</p>
      </div>
    );
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <Container ref={containerRef} onClick={handleClick}>
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
        <Fragment>
          <Divider>
            <Typography.Text type="secondary">剧终</Typography.Text>
          </Divider>
          {share}
        </Fragment>
      )}
    </Container>
  );
});
TRPGReportPreview.displayName = 'TRPGReportPreview';

export default TRPGReportPreview;
