import React, { useContext, useEffect } from 'react';
import { TMemo } from '@shared/components/TMemo';
import type { CommonPanelProps } from '@shared/components/panel/type';
import { GroupInfoContext } from '@shared/context/GroupInfoContext';
import _isNil from 'lodash/isNil';
import { Result } from 'antd';
import { GroupActorSelector } from '@web/routes/Main/Content/Group/GroupPanel/GroupActorSelector';
import { ensureGroupChannelConverse } from '@redux/actions/group';
import { useTRPGDispatch } from '@shared/hooks/useTRPGSelector';
import { ChatContainer } from '../chatBox/ChatContainer';

/**
 * 确保频道被正确创建
 * @param groupUUID 团UUID
 * @param channelUUID 频道UUID
 * @param channelName 频道名
 */
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
    <ChatContainer
      header={panel.name}
      headerActions={[
        <GroupActorSelector key="actor" groupUUID={groupInfo.uuid} />,
      ]}
      converseUUID={panel.target_uuid}
    />
  );
});
TextChannel.displayName = 'TextChannel';
