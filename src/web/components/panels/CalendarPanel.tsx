import React, { useCallback, useMemo } from 'react';
import { TMemo } from '@shared/components/TMemo';
import type { CommonPanelProps } from '@shared/components/panel/type';
import { Badge, Button, Calendar, Dropdown, Menu } from 'antd';
import type { Moment } from 'moment';
import { useCurrentGroupUUID } from '@shared/context/GroupInfoContext';
import {
  CommonGroupPanelData,
  getCommonGroupPanelData,
  setCommonGroupPanelData,
} from '@shared/model/group';
import { useAsync, useNumber } from 'react-use';
import _isString from 'lodash/isString';
import _isNil from 'lodash/isNil';
import { Loading } from '../Loading';
import classNames from 'classnames';
import { isToday } from '@shared/utils/date-helper';
import { closeModal, openModal } from '../Modal';
import { GroupCreateSchedule } from '../modals/GroupCreateSchedule';
import { showAlert, showToasts } from '@shared/manager/ui';
import { useTranslation } from '@shared/i18n';
import { useIsGroupManager } from '@redux/hooks/group';
import { useState } from 'react';
import moment from 'moment';
import styled from 'styled-components';
import shortid from 'shortid';
import { Iconfont } from '../Iconfont';
import { CommonPanel } from './CommonPanel';

const DateFormat = 'YYYY-MM-DD';

const Root = styled.div`
  overflow: auto;
`;

const CalendarDetailList = styled.div`
  overflow-wrap: break-word;

  > div {
    padding: 4px 8px;

    &:hover {
      background-color: ${(props) => props.theme.color.transparent90};
    }
  }
`;

interface CalendarPanelData extends CommonGroupPanelData {
  calendar: {
    _id: string;
    date: string; // YYYY-MM-DD
    note: string;
  }[];
}

export const CalendarPanel: React.FC<CommonPanelProps> = TMemo((props) => {
  const { panel } = props;
  const { uuid: panelUUID, name: panelName } = panel;
  const groupUUID = useCurrentGroupUUID();
  const [refetchIndex, { inc: refetchFn }] = useNumber();
  const { t } = useTranslation();
  const isGroupManager = useIsGroupManager(groupUUID ?? '');
  const [
    selectedCalendarDate,
    setSelectedCalendarDate,
  ] = useState<Moment | null>(null);

  const { value = [], loading } = useAsync(async (): Promise<
    CalendarPanelData['calendar']
  > => {
    if (!_isString(groupUUID)) {
      return [];
    }

    const panelData = await getCommonGroupPanelData(groupUUID, panelUUID);

    return panelData.calendar ?? [];
  }, [groupUUID, panelUUID, refetchIndex]);
  const selectedCalendarDataList = useMemo(() => {
    const todayStr = (selectedCalendarDate ?? moment()).format(DateFormat);

    return value.filter((item) => item.date === todayStr);
  }, [selectedCalendarDate, value]);

  const addCalendarSchedule = useCallback(
    async (date, note) => {
      if (!_isString(groupUUID)) {
        return;
      }

      const newValue = [
        ...value,
        {
          _id: shortid(),
          date,
          note,
        },
      ];

      await setCommonGroupPanelData(groupUUID, panelUUID, {
        calendar: newValue,
      });

      showToasts(t('操作成功'));
      refetchFn();
    },
    [groupUUID, panelUUID, value]
  );

  const removeCalendarSchedule = useCallback(
    async (id: string) => {
      if (!_isString(groupUUID)) {
        return;
      }

      if (!_isString(id)) {
        return;
      }

      const newValue = value.filter((item) => item._id !== id);

      await setCommonGroupPanelData(groupUUID, panelUUID, {
        calendar: newValue,
      });

      showToasts(t('操作成功'));
      refetchFn();
    },
    [groupUUID, panelUUID, value]
  );

  const handleCreateSchedule = useCallback(
    (dateStr: string) => {
      const key = openModal(
        <GroupCreateSchedule
          date={dateStr}
          onCreateSchedule={async ({ note }) => {
            await addCalendarSchedule(dateStr, note);
            closeModal(key);
          }}
        />
      );
    },
    [addCalendarSchedule, refetchFn]
  );

  const dateFullCellRender = useCallback(
    (date: Moment): React.ReactNode => {
      const dateStr = date.format(DateFormat);
      const notes = value
        .filter((item) => item.date === dateStr)
        .map((item) => item.note);

      const menu = (
        <Menu>
          {isGroupManager && (
            <Menu.Item key="1" onClick={() => handleCreateSchedule(dateStr)}>
              {t('创建日程')}
            </Menu.Item>
          )}
        </Menu>
      );

      const content = (
        <ul>
          {notes.map((n, i) => (
            <div key={i} title={n}>
              <Badge status="default" text={n} />
            </div>
          ))}
        </ul>
      );

      return (
        <Dropdown overlay={menu} trigger={['contextMenu']}>
          <div
            className={classNames(
              'ant-picker-cell-inner',
              'ant-picker-calendar-date',
              {
                'ant-picker-calendar-date-today': isToday(date),
              }
            )}
          >
            <div className="ant-picker-calendar-date-value">
              {String(date.date()).padStart(2, '0')}
            </div>
            <div className="ant-picker-calendar-date-content">{content}</div>
          </div>
        </Dropdown>
      );
    },
    [value]
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <CommonPanel header={panelName}>
      <Root>
        <Calendar
          dateFullCellRender={dateFullCellRender}
          onSelect={setSelectedCalendarDate}
        />

        <CalendarDetailList>
          {selectedCalendarDataList.map((item, i) => {
            return (
              <div key={i} title={item.note}>
                {item.note}

                {typeof item._id === 'string' && (
                  <Button
                    type="link"
                    onClick={() => {
                      showAlert({
                        message: t('确认要删除么?'),
                        onConfirm: () => {
                          removeCalendarSchedule(item._id);
                        },
                      });
                    }}
                  >
                    <Iconfont>&#xe76b;</Iconfont>
                  </Button>
                )}
              </div>
            );
          })}
        </CalendarDetailList>
      </Root>
    </CommonPanel>
  );
});
CalendarPanel.displayName = 'CalendarPanel';
