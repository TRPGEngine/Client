import React, { useCallback, useEffect } from 'react';
import { TMemo } from '@shared/components/TMemo';
import {
  Button,
  Divider,
  Empty,
  Result,
  Space,
  Table,
  Tooltip,
  Typography,
} from 'antd';
import { useTranslation } from '@shared/i18n';
import { openModal } from '@web/components/Modal';
import { BotCreate } from '@web/components/modal/BotCreate';
import { useAsyncFn } from 'react-use';
import {
  getMsgTokenBotList,
  MsgTokenBot,
  removeMsgTokenBot,
} from '@shared/model/bot';
import _isNil from 'lodash/isNil';
import _isString from 'lodash/isString';
import LoadingSpinner from '@web/components/LoadingSpinner';
import { ColumnsType } from 'antd/lib/table';
import { GroupChannelName } from '@web/components/GroupChannelName';
import styled from 'styled-components';
import { DeleteOutlined } from '@ant-design/icons';
import { showToasts } from '@shared/manager/ui';

const TokenText = styled(Typography.Paragraph).attrs({
  copyable: true,
})`
  margin: 0 !important;
`;

function useGroupBotManageAction(groupUUID: string) {
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

  const handleRemoveBot = useCallback(
    async (botUUID: string) => {
      if (_isString(botUUID)) {
        try {
          await removeMsgTokenBot(groupUUID, botUUID);
          fetchList();
          showToasts(t('删除成功'));
        } catch (err) {
          showToasts(err, 'error');
        }
      }
    },
    [groupUUID, fetchList]
  );

  const columns: ColumnsType<MsgTokenBot> = [
    {
      title: t('名称'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('Token'),
      dataIndex: 'token',
      key: 'token',
      render: (value) => <TokenText>{value}</TokenText>,
    },
    {
      title: t('频道'),
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
    {
      title: t('操作'),
      key: 'action',
      render: (value, record) => (
        <Space>
          <Tooltip title={t('删除')}>
            <Button
              danger={true}
              icon={<DeleteOutlined />}
              onClick={() => handleRemoveBot(value.uuid)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return { columns, listState: state, handleCreateBot };
}

interface GroupBotManageProps {
  groupUUID: string;
}
export const GroupBotManage: React.FC<GroupBotManageProps> = TMemo(
  (props: GroupBotManageProps) => {
    const { groupUUID } = props;
    const { t } = useTranslation();
    const { columns, listState, handleCreateBot } = useGroupBotManageAction(
      groupUUID
    );

    let list: React.ReactNode = null;

    if (!_isNil(listState.error)) {
      list = (
        <Result
          status="error"
          title={t('获取列表失败')}
          subTitle={String(listState.error)}
        />
      );
    } else if (listState.loading === true) {
      list = <LoadingSpinner />;
    } else if (listState.value?.length === 0) {
      list = <Empty />;
    } else if (!_isNil(listState.value)) {
      list = (
        <Table
          dataSource={listState.value}
          columns={columns}
          pagination={false}
        />
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
