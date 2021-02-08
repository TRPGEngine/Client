import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { useWebTokenInfo } from '@portal/hooks/useWebTokenInfo';
import { fetchOwnGroupList, fetchGroupRangeChatLog } from '@portal/model/group';
import _get from 'lodash/get';
import _isNil from 'lodash/isNil';
import _isEmpty from 'lodash/isEmpty';
import _isString from 'lodash/isString';
import { Select, Button, DatePicker, Form, Col, message } from 'antd';
import moment, { Moment } from 'moment';
import styled from 'styled-components';
import { LogEdit } from './log-edit';
import { PortraitContainer } from '@portal/components/PortraitContainer';
import type { MsgPayload } from '@redux/types/chat';
import { fetchGroupChannelPanelList, GroupItem } from '@shared/model/group';
import qs from 'qs';
import { useAsync } from 'react-use';
import { isUUID } from '@shared/utils/uuid';
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

// 仅以下类型的消息会被列入战报
const WHITE_LIST_MSGTYPE = ['normal', 'ooc', 'action', 'speak', 'tip'];

/**
 * 选择团和选择时间
 */
function useGroupTimeRange() {
  const [groupList, setGroupList] = useState<GroupItem[]>([]);
  const [selectedGroupUUID, setSelectedGroupUUID] = useState<string>();
  const [selectedChannel, setSelectedChannel] = useState('lobby');
  const [timeRange, setTimeRange] = useState<[Moment | null, Moment | null]>([
    moment().subtract(1, 'days').second(0).minute(0),
    moment().add(1, 'hours').second(0).minute(0),
  ]);

  useEffect(() => {
    fetchOwnGroupList().then((groupList) => {
      const query = qs.parse(window.location.search, {
        ignoreQueryPrefix: true,
      });
      const autoGroupUUID = query.groupUUID;

      if (groupList.map((group) => group.uuid).includes(autoGroupUUID)) {
        // 如果列表包含传入的UUID，则自动选中
        setSelectedGroupUUID(autoGroupUUID);
      }
      setGroupList(groupList);
    });
  }, []);

  const { value: groupChannelList = [] } = useAsync(async () => {
    if (_isString(selectedGroupUUID)) {
      return await fetchGroupChannelPanelList(selectedGroupUUID);
    }

    return [];
  }, [selectedGroupUUID]);

  useEffect(() => {
    // 选择的团变化时
    // 回复到lobby
    setSelectedChannel('lobby');
  }, [selectedGroupUUID]);

  const node = useMemo(() => {
    return (
      <Form labelCol={{ sm: 6 }} wrapperCol={{ sm: 18 }}>
        <h2 style={{ textAlign: 'center' }}>生成跑团战报</h2>
        <Form.Item label="选择团:">
          <Select
            value={selectedGroupUUID}
            onChange={(value) => setSelectedGroupUUID(value)}
            style={{ width: 240 }}
            placeholder="选择团"
          >
            {groupList.map((group) => (
              <Option key={group.uuid} value={group.uuid}>
                {group.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {typeof selectedGroupUUID === 'string' && (
          <Form.Item label="选择频道:">
            <Select
              value={selectedChannel}
              onChange={(value) => setSelectedChannel(value)}
              style={{ width: 240 }}
              placeholder="选择频道"
            >
              <Option key="lobby" value="lobby">
                大厅
              </Option>

              {groupChannelList.map((channel) => (
                <Option key={channel.target_uuid} value={channel.target_uuid}>
                  {channel.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}

        <Form.Item label="选择时间范围:">
          <RangePicker
            showTime={true}
            showSecond={false}
            minuteStep={5}
            value={timeRange}
            onChange={(values) => setTimeRange(values!)}
          />
        </Form.Item>
      </Form>
    );
  }, [
    selectedGroupUUID,
    setSelectedGroupUUID,
    selectedChannel,
    groupList,
    groupChannelList,
    timeRange,
    setTimeRange,
  ]);

  const disabled = useMemo(() => {
    return _isNil(selectedGroupUUID) || _isNil(timeRange);
  }, [selectedGroupUUID, timeRange]);

  return {
    disabled,
    selectedGroupUUID,
    selectedChannel,
    timeRange,
    node,
  };
}

const Container = styled(PortraitContainer)`
  padding: 10px;
`;

const SelectorCard = styled.div`
  box-shadow: ${(props) => props.theme.boxShadow.normal};
  border-radius: ${(props) => props.theme.radius.card};
  padding: 10px;
  /* margin: 15vh auto 10px; */
  max-width: 480px;
  background-color: white;
`;

const TipText = styled.div`
  color: ${(props) => props.theme.color['dusty-gray']};
  font-size: 12px;
  margin-top: 4px;
`;

const TRPGReportCreate: React.FC = TMemo(() => {
  const userInfo = useWebTokenInfo();
  const {
    disabled,
    selectedGroupUUID,
    selectedChannel,
    timeRange,
    node: groupTimeNode,
  } = useGroupTimeRange();
  const [showSelector, setShowSelector] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<MsgPayload[]>([]);

  const handleSelectGroupAndTimeRange = useCallback(() => {
    if (disabled) {
      return;
    }

    setIsLoading(true);
    const [from, to] = timeRange.map<string>(
      (time) => time?.format('YYYY-MM-DD HH:mm:ss') ?? ''
    );

    if (selectedGroupUUID) {
      const converseUUID = isUUID(selectedChannel) ? selectedChannel : null;

      fetchGroupRangeChatLog(selectedGroupUUID, converseUUID, from, to).then(
        (logs) => {
          setIsLoading(false);
          if (_isEmpty(logs)) {
            message.warn('数据为空');
            return;
          }
          setShowSelector(false);
          setLogs(logs.filter((log) => WHITE_LIST_MSGTYPE.includes(log.type)));
        }
      );
    } else {
      console.error('need selectedGroupUUID');
    }
  }, [disabled, selectedGroupUUID, selectedChannel, timeRange]);

  const Selector = useMemo(
    () => (
      <SelectorCard>
        {groupTimeNode}
        <Col sm={{ offset: 6 }}>
          <Button
            style={{ margin: 'auto' }}
            loading={isLoading}
            disabled={disabled}
            onClick={handleSelectGroupAndTimeRange}
          >
            下一步
          </Button>
          <TipText>
            数据需要一定时间准备，建议跑团结束10分后再来生成战报哦！
          </TipText>
        </Col>
      </SelectorCard>
    ),
    [groupTimeNode, isLoading, disabled, handleSelectGroupAndTimeRange]
  );

  return (
    <Container>
      {showSelector ? (
        Selector
      ) : (
        <LogEdit
          playerUUID={_get(userInfo, 'uuid')}
          groupUUID={selectedGroupUUID!}
          logs={logs}
        />
      )}
    </Container>
  );
});
TRPGReportCreate.displayName = 'TRPGReportCreate';

export default TRPGReportCreate;
