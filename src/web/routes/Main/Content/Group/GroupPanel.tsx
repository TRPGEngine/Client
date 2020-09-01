import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { useParams } from 'react-router';
import { Result } from 'antd';
import { GroupChatPanel } from './GroupPanel/GroupChatPanel';
import { useGroupPanelInfo } from '@redux/hooks/group';
import _isNil from 'lodash/isNil';
import { hasPanel } from '@shared/components/panel/reg';
import { GroupPanelView } from '@web/components/panels/__all__';

interface GroupPanelParams {
  groupUUID: string;
  panelUUID: string;
}

const GroupPanelRender: React.FC<GroupPanelParams> = TMemo((props) => {
  const { groupUUID, panelUUID } = props;
  const panel = useGroupPanelInfo(groupUUID, panelUUID);

  if (_isNil(panel)) {
    return (
      <div>
        <Result status="warning" title="找不到该面板" />
      </div>
    );
  }

  const type = panel.type;

  if (hasPanel(type)) {
    return <GroupPanelView panel={panel} />;
  }

  return (
    <div>
      <Result status="warning" title="未知的面板类型, 请检查客户端版本" />
    </div>
  );
});
GroupPanelRender.displayName = 'GroupPanelRender';

export const GroupPanel: React.FC = TMemo(() => {
  const params = useParams<GroupPanelParams>();
  const { groupUUID, panelUUID } = params;

  // 固定的显示
  if (panelUUID === 'main') {
    return <GroupChatPanel groupUUID={groupUUID} />;
  }

  return <GroupPanelRender groupUUID={groupUUID} panelUUID={panelUUID} />;
});
GroupPanel.displayName = 'GroupPanel';
