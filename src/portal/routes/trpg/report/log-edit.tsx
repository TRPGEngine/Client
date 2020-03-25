import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { ChatLogItem } from '@portal/model/chat';
import MessageHandler from '@web/components/messageTypes/__all__';
import { useUserInfo } from '@portal/hooks/useUserInfo';
import styled from 'styled-components';
import { Row, Button, Checkbox, Modal, Form, Input } from 'antd';
import _pick from 'lodash/pick';
import { useModal } from '@web/hooks/useModal';

const logRequireKey = [
  'uuid',
  'sender_uuid',
  'message',
  'type',
  'data',
  'revoke',
] as const; // 消息log必须的字段
interface EditableLogs extends Pick<ChatLogItem, typeof logRequireKey[number]> {
  selected: boolean;
}

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
  log: EditableLogs;
  playerUUID: string;
  onSelect: () => void;
}
const LogEditItem: React.FC<LogEditItemProps> = TMemo((props) => {
  const log = props.log;
  const userInfo = useUserInfo(log.sender_uuid);

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
      <div>
        <Checkbox checked={log.selected} />
      </div>
      <div style={{ flex: 1 }}>
        <MessageHandler
          key={log.uuid}
          type={log.type}
          me={log.sender_uuid === props.playerUUID}
          name={userInfo.nickname ?? userInfo.username}
          avatar={userInfo.avatar}
          emphasizeTime={false}
          info={log}
        />
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
  const [logs, setLogs] = useState<EditableLogs[]>([]);
  useEffect(() => {
    setLogs(
      props.logs
        .filter((log) => log.type !== 'card') // 过滤卡片消息
        .map((log) => {
          const selected = log.type !== 'ooc'; // 如果消息类型为ooc, 则默认不选中

          return {
            ..._pick(log, logRequireKey), // 压缩字段，只保留必要信息
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
    const selectedLogs = logs.filter((log) => log.selected);

    // TODO
    console.log(reportName, selectedLogs);
  }, [reportName, logs]);

  const { modal, showModal } = useModal(
    '生成战报',
    <Form labelCol={{ sm: 6 }} wrapperCol={{ sm: 18 }}>
      <h2 style={{ textAlign: 'center' }}>生成跑团战报</h2>
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
            playerUUID={props.playerUUID}
            onSelect={() => handleSelect(index)}
          />
        );
      })}

      <Row>
        <Button onClick={showModal} block={true}>
          生成战报
        </Button>
      </Row>

      {modal}
    </div>
  );
});
LogEdit.displayName = 'LogEdit';
