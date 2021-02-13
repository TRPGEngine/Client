import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { TMemo } from '@shared/components/TMemo';
import type { ChatLogItem } from '@shared/model/chat';
import styled from 'styled-components';
import { Row, Button, Checkbox, Modal, Form, Input, message } from 'antd';
import _pick from 'lodash/pick';
import { useModal } from '@web/hooks/useModal';
import {
  createTRPGGameReport,
  reportLogRequireKey,
  EditLogItem,
} from '@shared/model/trpg';
import { handleError } from '@web/utils/error';
import history from '@portal/history';
import { LogItem } from './log-item';
import Loading from '@portal/components/Loading';
import { ReportContextProvider } from './context';

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
  groupUUID: string;
  logs: ChatLogItem[];
}
export const LogEdit: React.FC<LogEditProps> = TMemo((props) => {
  const playerUUID = props.playerUUID;
  const groupUUID = props.groupUUID;
  const [logs, setLogs] = useState<EditLogItem[]>([]);

  const handleReset = useCallback(() => {
    // 回到默认选择状态
    const newLogs = props.logs
      .filter((log) => log.type !== 'card') // 过滤卡片消息
      .map((log) => {
        const selected = log.type !== 'ooc'; // 如果消息类型为ooc, 则默认不选中

        return {
          ..._pick(log, reportLogRequireKey), // 压缩字段，只保留必要信息
          selected,
        };
      });

    setLogs(newLogs);
  }, [props.logs]);

  useEffect(() => {
    handleReset();
  }, [props.logs]);

  const handleSelect = useCallback(
    (index: number) => {
      const _logs = [...logs];
      _logs[index].selected = !_logs[index].selected;
      setLogs(_logs);
    },
    [logs, setLogs]
  );

  const handleChangeAll = useCallback(
    (target: boolean) => {
      // 批量选择(取消选择)
      setLogs(
        logs.map((log) => ({
          ...log,
          selected: target,
        }))
      );
    },
    [logs]
  );

  const checkAll = useMemo(() => {
    const selectedList = logs.map((log) => Boolean(log.selected));

    return !selectedList.some((x) => x === false);
  }, [logs]);

  const indeterminate = useMemo(() => {
    const selectedList = logs.map((log) => Boolean(log.selected));

    if (selectedList.length === 0) {
      return true;
    }

    if (selectedList[0] === true) {
      return selectedList.some((x) => x === false);
    } else {
      return selectedList.some((x) => x === true);
    }
  }, [logs]);

  const [reportName, setReportName] = useState('');

  // 生成跑团战报
  const createTRPGReport = useCallback(() => {
    const selectedLogs = logs
      .filter((log) => log.selected) // 获取选中的记录
      .map((log) => _pick(log, reportLogRequireKey)); // 仅提取需要的字段

    setModalLoading(true);
    createTRPGGameReport(reportName, playerUUID, groupUUID, selectedLogs)
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
  }, [reportName, playerUUID, groupUUID, logs]);

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
    <ReportContextProvider>
      <div>
        <Row style={{ padding: 10 }} align="middle" justify="space-between">
          <Checkbox
            indeterminate={indeterminate}
            checked={checkAll}
            onChange={(e) => handleChangeAll(e.target.checked)}
          >
            选择所有
          </Checkbox>

          <Button onClick={handleReset}>重置</Button>
        </Row>

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
    </ReportContextProvider>
  );
});
LogEdit.displayName = 'LogEdit';
