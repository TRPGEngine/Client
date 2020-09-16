import React, { useEffect, useState } from 'react';
import { TMemo } from '@shared/components/TMemo';
import {
  fetchUserPrivateLoginLog,
  PlayerUserLoginLogType,
} from '@shared/model/player';
import _isArray from 'lodash/isArray';
import { Table } from 'antd';
import { TableProps } from 'antd/lib/table/Table';
import { getFullDate } from '@shared/utils/date-helper';
import { t } from '@shared/i18n';

const columns: TableProps<PlayerUserLoginLogType>['columns'] = [
  {
    title: t('登录时间'),
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: (value, record, index) => getFullDate(value),
  },
  {
    title: t('离线时间'),
    dataIndex: 'offline_date',
    key: 'offline_date',
    render: (value, record, index) => getFullDate(value),
  },
  {
    title: t('登录类型'),
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: 'IP',
    dataIndex: 'ip',
    key: 'ip',
    render: (value, record, index) => record.ip_address ?? record.ip,
  },
  {
    title: t('登录结果'),
    dataIndex: 'is_success',
    key: 'is_success',
    render: (value) => (value === true ? t('成功') : t('失败')),
  },
];

export const AccountLoginLog: React.FC = TMemo(() => {
  const [logs, setLogs] = useState<PlayerUserLoginLogType[]>([]);

  useEffect(() => {
    fetchUserPrivateLoginLog().then(setLogs);
  }, []);

  if (!_isArray(logs)) {
    return null;
  }

  return <Table columns={columns} dataSource={logs} pagination={false} />;
});
AccountLoginLog.displayName = 'AccountLoginLog';
