import React, { useCallback, useEffect } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { useAsync, useAsyncFn } from 'react-use';
import {
  fetchGroupRequestList,
  GroupRequestItem,
  requestAgreeGroupRequest,
  requestRefuseGroupRequest,
} from '@shared/model/group';
import { Loading } from '@web/components/Loading';
import { UserListItem } from '@web/components/UserListItem';
import { Button, Empty } from 'antd';
import _isNil from 'lodash/isNil';
import { useTranslation } from '@shared/i18n';

const RequestItem: React.FC<{
  requestInfo: GroupRequestItem;
  onRefresh: () => void;
}> = TMemo(({ requestInfo, onRefresh }) => {
  const { t } = useTranslation();
  const handleAgreeGroupRequest = useCallback(async () => {
    await requestAgreeGroupRequest(requestInfo.uuid);
    onRefresh();
  }, [requestInfo.uuid, onRefresh]);

  const handleRefuseGroupRequest = useCallback(async () => {
    await requestRefuseGroupRequest(requestInfo.uuid);
    onRefresh();
  }, [requestInfo.uuid, onRefresh]);

  return (
    <UserListItem
      userUUID={requestInfo.from_uuid}
      actions={[
        <Button type="ghost" key="refuse" onClick={handleRefuseGroupRequest}>
          {t('拒绝')}
        </Button>,
        <Button type="primary" key="agree" onClick={handleAgreeGroupRequest}>
          {t('同意')}
        </Button>,
      ]}
    />
  );
});
RequestItem.displayName = 'RequestItem';

interface GroupRequestListProps {
  groupUUID: string;
}
export const GroupRequestList: React.FC<GroupRequestListProps> = TMemo(
  (props) => {
    const { groupUUID } = props;

    const [
      { value: requestList, loading },
      fetchList,
    ] = useAsyncFn(async () => {
      return fetchGroupRequestList(groupUUID);
    }, [groupUUID]);

    useEffect(() => {
      fetchList();
    }, []);

    if (loading) {
      return <Loading />;
    }

    if (_isNil(requestList) || !Array.isArray(requestList)) {
      return null;
    }

    if (requestList.length === 0) {
      return <Empty />;
    }

    return (
      <div>
        {requestList.map((item) => (
          <RequestItem
            key={item.uuid}
            requestInfo={item}
            onRefresh={fetchList}
          />
        ))}
      </div>
    );
  }
);
GroupRequestList.displayName = 'GroupRequestList';
