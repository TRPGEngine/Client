import React, { Fragment, useCallback, useEffect, useMemo } from 'react';
import { TMemo } from '@shared/components/TMemo';
import {
  Button,
  Divider,
  Dropdown,
  Menu,
  message,
  Row,
  Space,
  Table,
} from 'antd';
import { openPortalWindow } from '@web/components/StandaloneWindow';
import {
  deleteGroupReport,
  fetchGroupReport,
  fetchTRPGGameReport,
  GameReportSimple,
} from '@shared/model/trpg';
import { useAsyncFn } from 'react-use';
import { LoadingSpinner } from '@web/components/LoadingSpinner';
import _isNil from 'lodash/isNil';
import _uniq from 'lodash/uniq';
import _keyBy from 'lodash/keyBy';
import { useTranslation } from '@shared/i18n';
import type { TableProps } from 'antd/lib/table/Table';
import { useIsGroupManager } from '@redux/hooks/group';
import { MoreOutlined, ReloadOutlined } from '@ant-design/icons';
import { Iconfont } from '@web/components/Iconfont';
import { showAlert, showToasts } from '@shared/manager/ui';
import { fetchUserInfo } from '@shared/model/player';
import { MsgDataManager } from '@shared/utils/msg-helper';
import { getUserName } from '@shared/utils/data-helper';
import { downloadBlob } from '@web/utils/file-helper';
import { reportError } from '@web/utils/error';
import { bbcodeToPlainText } from '@shared/components/bbcode/serialize';
import { isUserUUID } from '@shared/utils/uuid';

interface GroupReportManageProps {
  groupUUID: string;
}

/**
 * 战报列表
 */

const GroupReportList: React.FC<GroupReportManageProps> = TMemo((props) => {
  const { groupUUID } = props;
  const { t } = useTranslation();
  const isGroupManager = useIsGroupManager(groupUUID);

  const [{ value: reportList, loading }, refreshReportList] = useAsyncFn(
    () => fetchGroupReport(groupUUID),
    [groupUUID]
  );

  useEffect(() => {
    refreshReportList();
  }, [groupUUID]);

  const handleRemoveReport = useCallback(
    (reportUUID: string) => {
      showAlert({
        message: t('确认要删除该战报么?'),
        onConfirm: async () => {
          try {
            await deleteGroupReport(reportUUID, groupUUID);
            showToasts(t('操作成功'));
            refreshReportList();
          } catch (err) {
            showToasts(String(err), 'error');
          }
        },
      });
    },
    [groupUUID, refreshReportList]
  );

  const handleExportToTxt = useCallback(async (record: GameReportSimple) => {
    const hide = message.loading(t('正在生成战报...'), 0);
    try {
      const reportDetail = await fetchTRPGGameReport(record.uuid);

      const logs = reportDetail.content.logs ?? [];

      // 所有相关人员的用户信息
      const userInfoMap: Record<
        string,
        { username: string; nickname: string }
      > = _keyBy(
        await Promise.all(
          _uniq(logs.map((log) => log.sender_uuid))
            .filter((uuid) => isUserUUID(uuid))
            .map((uuid) => fetchUserInfo(uuid))
        ),
        'uuid'
      );

      // Builtin user
      userInfoMap['trpgsystem'] = {
        username: t('系统消息'),
        nickname: t('系统消息'),
      };

      // 根据日志生成文本
      const text = logs
        .map((log) => {
          const msgDataManager = new MsgDataManager();
          msgDataManager.parseData(log.data);
          const senderInfo = userInfoMap[log.sender_uuid];
          const senderName =
            msgDataManager.getMsgDataSenderName() ?? getUserName(senderInfo);

          return `${senderName}: ${bbcodeToPlainText(log.message)}`;
        })
        .join('\n');

      const blob = new Blob([text], {
        type: 'text/plain',
      });
      downloadBlob(blob, `${reportDetail.title}.txt`);

      showToasts(t('生成完毕'), 'success');
    } catch (err) {
      showToasts(String(err), 'error');
      reportError(err);
    } finally {
      hide();
    }
  }, []);

  const columns: TableProps<GameReportSimple>['columns'] = useMemo(() => {
    return [
      {
        title: t('标题'),
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: t('操作'),
        dataIndex: 'operation',
        key: 'operation',
        render: (value, record, index) => (
          <Space>
            <Button
              onClick={() =>
                openPortalWindow(`/trpg/report/preview/${record.uuid}`)
              }
            >
              {t('预览')}
            </Button>

            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item key="1" onClick={() => handleExportToTxt(record)}>
                    {t('导出为TXT')}
                  </Menu.Item>
                </Menu>
              }
              placement="bottomLeft"
              trigger={['click']}
            >
              <Button icon={<MoreOutlined />} />
            </Dropdown>

            {isGroupManager && (
              <Button
                type="ghost"
                danger={true}
                icon={<Iconfont>&#xe76b;</Iconfont>}
                onClick={() => handleRemoveReport(record.uuid)}
              />
            )}
          </Space>
        ),
      },
    ];
  }, [isGroupManager, handleRemoveReport]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (_isNil(reportList)) {
    return null;
  }

  return (
    <div>
      <Row justify="end" style={{ marginBottom: 4 }}>
        <Button icon={<ReloadOutlined />} onClick={refreshReportList} />
      </Row>

      <Table columns={columns} dataSource={reportList} pagination={false} />
    </div>
  );
});
GroupReportList.displayName = 'GroupReportList';

/**
 * 战报管理器
 */
export const GroupReportManage: React.FC<GroupReportManageProps> = TMemo(
  (props) => {
    const { groupUUID } = props;
    const isGroupManager = useIsGroupManager(groupUUID);
    const { t } = useTranslation();

    const handleCreateReport = useCallback(() => {
      openPortalWindow(`/trpg/report/create?groupUUID=${groupUUID}`);
    }, [groupUUID]);

    return (
      <div>
        {isGroupManager && (
          <Fragment>
            <Button type="primary" onClick={handleCreateReport}>
              {t('创建战报')}
            </Button>

            <Divider />
          </Fragment>
        )}

        {/* 战报列表 */}
        <GroupReportList groupUUID={groupUUID} />
      </div>
    );
  }
);
GroupReportManage.displayName = 'GroupReportManage';
