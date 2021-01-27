import React, { useCallback } from 'react';
import { TMemo } from '@shared/components/TMemo';
import type { RouteComponentProps } from 'react-router';
import { useAsync } from 'react-use';
import {
  fetchGroupInviteCodeInfo,
  fetchGroupInfo,
  applyGroupInviteCode,
} from '@shared/model/group';
import Loading from '@portal/components/Loading';
import _isNil from 'lodash/isNil';
import _isString from 'lodash/isString';
import { Result, Button } from 'antd';
import { showToasts } from '@shared/manager/ui';
import { fetchUserInfo } from '@shared/model/player';
import { getUserName } from '@shared/utils/data-helper';
import { PortalCard } from '@portal/components/PortalCard';
import Avatar from '@web/components/Avatar';
import styled from 'styled-components';
import { handleError } from '@web/utils/error';
import { WaveBackground } from '@web/components/WaveBackground';

const Container = styled.div`
  text-align: center;
  padding: 10px;
`;

const InviteText = styled.div`
  margin: 10px 0;
`;

interface Props
  extends RouteComponentProps<{
    inviteCode: string;
  }> {}
const GroupInviteCode: React.FC<Props> = TMemo((props) => {
  const inviteCode = props.match.params.inviteCode;

  const { value, loading, error } = useAsync(async () => {
    const invite = await fetchGroupInviteCodeInfo(inviteCode);
    if (_isNil(invite)) {
      throw new Error('找不到邀请信息');
    }

    const group = await fetchGroupInfo(invite.group_uuid);
    if (_isNil(group)) {
      throw new Error('找不到团');
    }

    const inviterUUID = invite.from_uuid;
    const inviterInfo = await fetchUserInfo(inviterUUID);

    return {
      inviteCode: invite.code,
      inviterName: getUserName(inviterInfo),
      groupUUID: group.uuid,
      groupAvatar: group.avatar,
      groupName: group.name,
    };
  }, [inviteCode]);

  const handleJoin = useCallback(async () => {
    if (!_isString(value?.inviteCode)) {
      showToasts('加入信息出现异常');
      return;
    }

    // 发送加入请求
    const isSuccess = await applyGroupInviteCode(value?.inviteCode!).catch(
      handleError
    );
    if (isSuccess) {
      // 跳转到结果页
      props.history.replace(
        '/result/success?title=您已成功加入团&subTitle=您现在可以回到TRPG Engine客户端查看结果'
      );
    }
  }, [value?.inviteCode, props.history]);

  if (loading) {
    return <Loading />;
  }

  if (!_isNil(error)) {
    return <Result status="error" title={String(error)} />;
  }

  if (_isNil(value)) {
    return null;
  }

  return (
    <PortalCard>
      <WaveBackground />
      <Container>
        <div>
          <Avatar src={value.groupAvatar} name={value.groupName} size={64} />
        </div>
        <InviteText>
          {value.inviterName} 邀请您加入团 {value.groupName}
        </InviteText>
        <Button type="primary" block={true} size="large" onClick={handleJoin}>
          加入团
        </Button>
      </Container>
    </PortalCard>
  );
});
GroupInviteCode.displayName = 'GroupInviteCode';

export default GroupInviteCode;
