import React, { useCallback } from 'react';
import { Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { showModal } from '@redux/actions/ui';
import GroupRuleEditor from './modal/GroupRuleEditor';
import { TRPGState } from '@redux/types/__all__';
import { isGroupManager } from '@shared/model/group';
import { GroupInfo } from '@redux/types/group';
import HTML from '@web/components/HTML';
import _isEmpty from 'lodash/isEmpty';

const GroupRule = React.memo(() => {
  const dispatch = useDispatch();
  const groupInfo = useSelector<TRPGState, GroupInfo>((state) => {
    const selectedGroupUUID = state.group.selectedGroupUUID;
    return state.group.groups.find((group) => group.uuid === selectedGroupUUID);
  });
  const isManager = useSelector<TRPGState, boolean>((state) => {
    const userUUID = state.user.info.uuid;

    return isGroupManager(groupInfo, userUUID);
  });

  const handleEditRule = useCallback(() => {
    dispatch(showModal(<GroupRuleEditor />));
  }, [dispatch]);

  return (
    <div style={{ padding: 10 }}>
      {isManager && (
        <Button type="primary" onClick={handleEditRule}>
          编辑团规
        </Button>
      )}
      {!_isEmpty(groupInfo.rule) ? (
        <div>
          <HTML html={groupInfo.rule} />
        </div>
      ) : (
        '主持人暂未写入规则'
      )}
    </div>
  );
});

export default GroupRule;
