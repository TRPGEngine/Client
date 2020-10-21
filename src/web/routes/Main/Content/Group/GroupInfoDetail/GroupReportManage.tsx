import React, { useCallback } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { Button } from 'antd';
import { openPortalWindow } from '@web/components/StandaloneWindow';

interface GroupReportManageProps {
  groupUUID: string;
}
export const GroupReportManage: React.FC<GroupReportManageProps> = TMemo(
  (props) => {
    const { groupUUID } = props;

    const handleCreateReport = useCallback(() => {
      openPortalWindow(`/trpg/report/create?groupUUID=${groupUUID}`);
    }, [groupUUID]);

    return (
      <div>
        <Button type="primary" onClick={handleCreateReport}>
          创建战报
        </Button>

        {/* 战报列表 */}
      </div>
    );
  }
);
GroupReportManage.displayName = 'GroupReportManage';
