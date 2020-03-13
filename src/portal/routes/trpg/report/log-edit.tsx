import React, { useState, useEffect, useCallback } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { ChatLogItem } from '@portal/model/chat';
import MessageHandler from '@web/components/messageTypes/__all__';
import { useUserInfo } from '@portal/hooks/useUserInfo';
import styled from 'styled-components';
import { Row, Button, Checkbox } from 'antd';

interface EditableLogs extends ChatLogItem {
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
      props.onSelect();
    },
    [props.onSelect]
  );

  return (
    <LogEditItemContainer onClick={handleClick}>
      <div>
        <Checkbox value={log.selected} />
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
          const selected = log.type !== 'ooc';

          return {
            ...log,
            selected,
          };
        })
    );
  }, [props.logs]);

  const handleSelect = useCallback(
    (index: number) => {
      logs[index].selected = !logs[index].selected;
    },
    [logs]
  );

  return (
    <div>
      {logs.map((log, index) => {
        return (
          <LogEditItem
            log={log}
            playerUUID={props.playerUUID}
            onSelect={() => handleSelect(index)}
          />
        );
      })}

      <Row>
        {/* TODO */}
        <Button>导出</Button>
      </Row>
    </div>
  );
});
LogEdit.displayName = 'LogEdit';
