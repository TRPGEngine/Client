import React, { useState, useEffect, useCallback } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { ChatLogItem } from '@portal/model/chat';
import styled from 'styled-components';
import { Row, Button, Checkbox, Modal, Form, Input, message } from 'antd';
import _pick from 'lodash/pick';
import { useModal } from '@web/hooks/useModal';
import {
  createTRPGGameReport,
  reportLogRequireKey,
  EditLogItem,
} from '@portal/model/trpg';
import { handleError } from '@portal/utils/error';
import history from '@portal/history';
import { LogItem } from './log-item';
import Loading from '@portal/components/Loading';

const LogEditItemContainer = styled.div`
  width: 100%;
  cursor: pointer;
  display: flex;
  padding: 0 10px;
  align-items: center;

  &:hover {
    background-color: ${(props) => props.theme.color.transparent90};
  }

  .msg-item {
    margin: 0;
  }
`;

interface LogEditItemProps {
  log: EditLogItem;
  playerUUID: string;
  onSelect: () => void;
}
const LogEditItem: React.FC<LogEditItemProps> = TMemo((props) => {
  const { log } = props;

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.stopPropagation();
      e.preventDefault();
      props.onSelect();
    },
    [props.onSelect]
  );

  return (
    <LogEditItemContainer onClickCapture={handleClick}>
      <div style={{ marginRight: 6 }}>
        <Checkbox checked={log.selected} />
      </div>
      <div style={{ flex: 1 }}>
        <LogItem logItem={log} playerUUID={props.playerUUID} />
      </div>
    </LogEditItemContainer>
  );
});
LogEditItem.displayName = 'LogEditItem';

interface LogEditProps {
  playerUUID: string;
  logs: ChatLogItem[];
}
export const LogEdit: React.FC<LogEditProps> = TMemo((props) => {
  const playerUUID = props.playerUUID;
  const [logs, setLogs] = useState<EditLogItem[]>([]);
  useEffect(() => {
    setLogs(
      props.logs
        .filter((log) => log.type !== 'card') // 过滤卡片消息
        .map((log) => {
          const selected = log.type !== 'ooc'; // 如果消息类型为ooc, 则默认不选中

          return {
            ..._pick(log, reportLogRequireKey), // 压缩字段，只保留必要信息
            selected,
          };
        })
    );
  }, [props.logs]);

  const handleSelect = useCallback(
    (index: number) => {
      const _logs = [...logs];
      _logs[index].selected = !_logs[index].selected;
      setLogs(_logs);
    },
    [logs, setLogs]
  );

  const [reportName, setReportName] = useState('');

  // 生成跑团战报
  const createTRPGReport = useCallback(() => {
    const selectedLogs = logs
      .filter((log) => log.selected) // 获取选中的记录
      .map((log) => _pick(log, reportLogRequireKey)); // 仅提取需要的字段

    setModalLoading(true);
    createTRPGGameReport(reportName, playerUUID, selectedLogs)
      .then((reportUUID) => {
        message.success('创建成功, 1秒后跳转到预览');
        setTimeout(
          () => history.push(`/trpg/report/preview/${reportUUID}`),
          1000
        );
      })
      .catch(handleError)
      .finally(() => {
        setModalLoading(false);
      });
  }, [reportName, playerUUID, logs]);

  const { modal, showModal, setLoading: setModalLoading } = useModal(
    '生成战报',
    <Form labelCol={{ sm: 6 }} wrapperCol={{ sm: 18 }}>
      <Form.Item label="战报名">
        <Input
          value={reportName}
          onChange={(e) => setReportName(e.target.value)}
        />
      </Form.Item>
    </Form>,
    createTRPGReport
  );

  return (
    <div>
      {logs.map((log, index) => {
        return (
          <LogEditItem
            key={log.uuid}
            log={log}
            playerUUID={playerUUID}
            onSelect={() => handleSelect(index)}
          />
        );
      })}

      {logs.length > 0 ? (
        <Row>
          <Button onClick={showModal} block={true} style={{ marginTop: 10 }}>
            生成战报
          </Button>
        </Row>
      ) : (
        <Loading />
      )}

      {modal}
    </div>
  );
});
LogEdit.displayName = 'LogEdit';
