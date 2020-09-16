import React, { useContext, useEffect } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { CommonPanelProps } from '@shared/components/panel/type';
import { GroupInfoContext } from '@shared/context/GroupInfoContext';
import _isNil from 'lodash/isNil';
import { Result } from 'antd';
import { CommonPanel } from './CommonPanel';
import { GroupActorSelector } from '@web/routes/Main/Content/Group/GroupPanel/GroupActorSelector';
import { ChatBody } from '../chatBox/ChatBody';
import { ensureGroupChannelConverse } from '@redux/actions/group';
import { useTRPGDispatch } from '@shared/hooks/useTRPGSelector';

function useCheckGroupChannel(
  groupUUID: string,
  channelUUID: string,
  channelName: string
) {
  const dispatch = useTRPGDispatch();
  useEffect(() => {
    // 需要确保会话被正确创建
    dispatch(
      ensureGroupChannelConverse({ groupUUID, channelUUID, channelName })
    );
  }, [channelUUID]);
}

/**
 * 文字频道
 */
export const TextChannel: React.FC<CommonPanelProps> = TMemo((props) => {
  const { panel } = props;
  const groupInfo = useContext(GroupInfoContext);
  const channelUUID = panel.target_uuid;
  useCheckGroupChannel(groupInfo?.uuid ?? '', channelUUID, panel.name);

  if (_isNil(groupInfo)) {
    return <Result status="warning" title="无法获取团信息" />;
  }

  return (
    <CommonPanel
      headerPrefix="#"
      header={panel.name}
      headerActions={[
        <GroupActorSelector key="actor" groupUUID={groupInfo.uuid} />,
      ]}
    >
      <ChatBody converseUUID={panel.target_uuid} />
    </CommonPanel>
  );
});
TextChannel.displayName = 'TextChannel';
