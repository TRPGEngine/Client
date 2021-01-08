import React, { useCallback } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { CommonPanelProps } from '@shared/components/panel/type';
import { Badge, Calendar, Dropdown, Menu } from 'antd';
import type { Moment } from 'moment';
import { useCurrentGroupUUID } from '@shared/context/GroupInfoContext';
import {
  CommonGroupPanelData,
  getCommonGroupPanelData,
  setCommonGroupPanelData,
} from '@shared/model/group';
import { useAsync, useNumber, useUpdate } from 'react-use';
import _isString from 'lodash/isString';
import { Loading } from '../Loading';
import classNames from 'classnames';
import { isToday } from '@shared/utils/date-helper';
import { closeModal, openModal } from '../Modal';
import { GroupCreateSchedule } from '../modals/GroupCreateSchedule';
import { showToasts } from '@shared/manager/ui';
import { useTranslation } from '@shared/i18n';

interface CalendarPanelData extends CommonGroupPanelData {
  calendar: {
    date: string; // YYYY-MM-DD
    note: string;
  }[];
}

export const CalendarPanel: React.FC<CommonPanelProps> = TMemo((props) => {
  const { panel } = props;
  const { uuid: panelUUID } = panel;
  const groupUUID = useCurrentGroupUUID();
  const [refetchIndex, { inc: refetchFn }] = useNumber();
  const { t } = useTranslation();

  const { value = [], loading } = useAsync(async (): Promise<
    CalendarPanelData['calendar']
  > => {
    if (!_isString(groupUUID)) {
      return [];
    }

    const panelData = await getCommonGroupPanelData(groupUUID, panelUUID);

    return panelData.calendar ?? [];
  }, [groupUUID, panelUUID, refetchIndex]);

  const addCalendarSchedule = useCallback(
    async (date, note) => {
      if (!_isString(groupUUID)) {
        return;
      }

      const newValue = [
        ...value,
        {
          date,
          note,
        },
      ];

      await setCommonGroupPanelData(groupUUID, panelUUID, {
        calendar: newValue,
      });
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
            showToasts(t('操作成功'));
            closeModal(key);
            refetchFn();
          }}
        />
      );
    },
    [addCalendarSchedule, refetchFn]
  );

  const dateFullCellRender = useCallback(
    (date: Moment): React.ReactNode => {
      const dateStr = date.format('YYYY-MM-DD');
      const notes = value
        .filter((item) => item.date === dateStr)
        .map((item) => item.note);

      const menu = (
        <Menu>
          <Menu.Item key="1" onClick={() => handleCreateSchedule(dateStr)}>
            {t('创建日程')}
          </Menu.Item>
          {/* TODO */}
          {/* <Menu.Item key="2">管理日程</Menu.Item> */}
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
    <div>
      <Calendar dateFullCellRender={dateFullCellRender} />
    </div>
  );
});
CalendarPanel.displayName = 'CalendarPanel';
