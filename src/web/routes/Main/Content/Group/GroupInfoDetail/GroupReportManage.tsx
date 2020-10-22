import React, { Fragment, useCallback, useMemo } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { Button, Divider, Table } from 'antd';
import { openPortalWindow } from '@web/components/StandaloneWindow';
import { fetchGroupReport, GameReport } from '@shared/model/trpg';
import { useAsync } from 'react-use';
import { LoadingSpinner } from '@web/components/LoadingSpinner';
import _isNil from 'lodash/isNil';
import { useTranslation } from '@shared/i18n';
import { TableProps } from 'antd/lib/table/Table';
import { useIsGroupManager } from '@redux/hooks/group';

interface GroupReportManageProps {
  groupUUID: string;
}

/**
 * 战报列表
 */

const GroupReportList: React.FC<GroupReportManageProps> = TMemo((props) => {
  const { groupUUID } = props;
  const { t } = useTranslation();
  const { value: reportList, loading } = useAsync(
    () => fetchGroupReport(groupUUID),
    [groupUUID]
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
          <div>
            <Button
              onClick={() =>
                openPortalWindow(`/trpg/report/preview/${record.uuid}`)
              }
            >
              {t('预览')}
            </Button>
          </div>
        ),
      },
    ];
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (_isNil(reportList)) {
    return null;
  }

  return <Table columns={columns} dataSource={reportList} pagination={false} />;
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
