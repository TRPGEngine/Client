import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { useWebTokenInfo } from '@portal/hooks/useWebTokenInfo';
import {
  fetchOwnGroupList,
  GroupItem,
  fetchGroupChatLog,
} from '@portal/model/group';
import _get from 'lodash/get';
import _isNil from 'lodash/isNil';
import _isEmpty from 'lodash/isEmpty';
import { Select, Button, DatePicker, Form, Col, message } from 'antd';
import moment, { Moment } from 'moment';
import styled from 'styled-components';
import { LogEdit } from './log-edit';
import { PortraitContainer } from '@portal/components/PortraitContainer';
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

/**
 * 选择团和选择时间
 */
function useGroupTimeRange() {
  const [groupList, setGroupList] = useState<GroupItem[]>([]);
  const [selectedGroupUUID, setSelectedGroupUUID] = useState<string>();
  const [timeRange, setTimeRange] = useState<[Moment, Moment]>([
    moment()
      .subtract(1, 'days')
      .second(0)
      .minute(0),
    moment()
      .add(1, 'hours')
      .second(0)
      .minute(0),
  ]);

  useEffect(() => {
    fetchOwnGroupList().then(setGroupList);
  }, []);

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
        <Form.Item label="选择时间范围:">
          <RangePicker
            showTime={true}
            showSecond={false}
            minuteStep={5}
            value={timeRange}
            onChange={(values) => setTimeRange(values)}
          />
        </Form.Item>
      </Form>
    );
  }, [
    selectedGroupUUID,
    setSelectedGroupUUID,
    groupList,
    timeRange,
    setTimeRange,
  ]);

  const disabled = useMemo(() => {
    return _isNil(selectedGroupUUID) || _isNil(timeRange);
  }, [selectedGroupUUID, timeRange]);

  return {
    disabled,
    selectedGroupUUID,
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
  margin: 15vh auto 10px;
  max-width: 480px;
`;

const TRPGReportCreate: React.FC = TMemo(() => {
  const userInfo = useWebTokenInfo();
  const {
    disabled,
    selectedGroupUUID,
    timeRange,
    node: groupTimeNode,
  } = useGroupTimeRange();
  const [showSelector, setShowSelector] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState([]);

  const handleSelectGroupAndTimeRange = useCallback(() => {
    if (disabled) {
      return;
    }

    setIsLoading(true);
    const [from, to] = timeRange.map((time) =>
      time.format('YYYY-MM-DD HH:mm:ss')
    );
    fetchGroupChatLog(selectedGroupUUID, from, to).then((logs) => {
      setIsLoading(false);
      if (_isEmpty(logs)) {
        message.warn('数据为空');
        return;
      }
      setShowSelector(false);
      setLogs(logs);
    });
  }, [disabled, selectedGroupUUID, timeRange]);

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
        <LogEdit playerUUID={_get(userInfo, 'uuid')} logs={logs} />
      )}
    </Container>
  );
});
TRPGReportCreate.displayName = 'TRPGReportCreate';

export default TRPGReportCreate;
