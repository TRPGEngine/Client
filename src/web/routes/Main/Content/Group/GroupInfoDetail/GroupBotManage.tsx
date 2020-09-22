import React, { useCallback, useEffect } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { Button, Divider, Empty, Result, Space, Table, Typography } from 'antd';
import { t, useTranslation } from '@shared/i18n';
import { openModal } from '@web/components/Modal';
import { BotCreate } from '@web/components/modal/BotCreate';
import { useAsyncFn } from 'react-use';
import { getMsgTokenBotList, MsgTokenBot } from '@shared/model/bot';
import _isNil from 'lodash/isNil';
import LoadingSpinner from '@web/components/LoadingSpinner';
import { ColumnsType } from 'antd/lib/table';
import { GroupChannelName } from '@web/components/GroupChannelName';
import styled from 'styled-components';

const TokenText = styled(Typography.Paragraph).attrs({
  copyable: true,
})`
  margin: 0 !important;
`;

const columns: ColumnsType<MsgTokenBot> = [
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Token',
    dataIndex: 'token',
    key: 'token',
    render: (value) => <TokenText>{value}</TokenText>,
  },
  {
    title: '频道',
    key: 'channel_uuid',
    render: (_, record) => {
      return (
        <GroupChannelName
          groupUUID={record.group_uuid}
          channelUUID={record.channel_uuid}
        />
      );
    },
  },
  // {
  //   title: t('操作'),
  //   key: 'action',
  //   render: (_, record) => (
  //     <Space>
  //       <Button danger={true}>删除</Button>
  //     </Space>
  //   ),
  // },
];

interface GroupBotManageProps {
  groupUUID: string;
}
export const GroupBotManage: React.FC<GroupBotManageProps> = TMemo(
  (props: GroupBotManageProps) => {
    const { groupUUID } = props;
    const { t } = useTranslation();

    const [state, fetchList] = useAsyncFn(async () => {
      const list = await getMsgTokenBotList(groupUUID);
      return list;
    }, [groupUUID]);

    const handleCreateBot = useCallback(() => {
      openModal(<BotCreate groupUUID={groupUUID} onSuccess={fetchList} />);
    }, [groupUUID, fetchList]);

    useEffect(() => {
      fetchList();
    }, []);

    let list: React.ReactNode = null;

    if (!_isNil(state.error)) {
      list = (
        <Result
          status="error"
          title="获取列表失败"
          subTitle={String(state.error)}
        />
      );
    } else if (state.loading === true) {
      list = <LoadingSpinner />;
    } else if (state.value?.length === 0) {
      list = <Empty />;
    } else if (!_isNil(state.value)) {
      list = (
        <Table dataSource={state.value} columns={columns} pagination={false} />
      );
    }

    return (
      <div>
        <Typography.Title level={3}>{t('机器人')}</Typography.Title>

        <Button type="primary" onClick={handleCreateBot}>
          {t('创建机器人')}
        </Button>

        <Divider />

        <Typography.Title level={4}>{t('机器人列表')}</Typography.Title>

        <div>{list}</div>
      </div>
    );
  }
);
GroupBotManage.displayName = 'GroupBotManage';
