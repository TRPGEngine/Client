import React, { Fragment, useCallback, useEffect, useMemo } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { Button, Divider, Row, Space, Table } from 'antd';
import { openPortalWindow } from '@web/components/StandaloneWindow';
import {
  deleteGroupReport,
  fetchGroupReport,
  GameReport,
} from '@shared/model/trpg';
import { useAsyncFn } from 'react-use';
import { LoadingSpinner } from '@web/components/LoadingSpinner';
import _isNil from 'lodash/isNil';
import { useTranslation } from '@shared/i18n';
import type { TableProps } from 'antd/lib/table/Table';
import { useIsGroupManager } from '@redux/hooks/group';
import { ReloadOutlined } from '@ant-design/icons';
import { Iconfont } from '@web/components/Iconfont';
import { showAlert, showToasts } from '@shared/manager/ui';

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
        message: '确认要删除该战报么?',
        onConfirm: async () => {
          try {
            await deleteGroupReport(reportUUID, groupUUID);
            showToasts('操作成功');
            refreshReportList();
          } catch (err) {
            showToasts(String(err), 'error');
          }
        },
      });
    },
    [groupUUID, refreshReportList]
  );

  const columns: TableProps<GameReport>['columns'] = useMemo(() => {
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

    const handleCreateReport = useCallback(() => {
      openPortalWindow(`/trpg/report/create?groupUUID=${groupUUID}`);
    }, [groupUUID]);

    return (
      <div>
        {isGroupManager && (
          <Fragment>
            <Button type="primary" onClick={handleCreateReport}>
              创建战报
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
