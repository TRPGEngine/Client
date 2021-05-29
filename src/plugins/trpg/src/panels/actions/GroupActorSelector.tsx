import React, { useCallback } from 'react';
import { TMemo } from '@capital/shared/components/TMemo';
import { Select } from 'antd';
import {
  useSelfGroupActors,
  useSelectedGroupActorUUID,
} from '@capital/shared/redux/hooks/group';
import { useTRPGDispatch } from '@capital/shared/redux/hooks/useTRPGSelector';
import { changeSelectGroupActor } from '@capital/shared/redux/actions/group';
import { useTranslation } from '@capital/shared/i18n';
import { useCurrentGroupUUID } from '@capital/shared/context/GroupInfoContext';
const Option = Select.Option;

export const GroupActorSelector: React.FC = TMemo((props) => {
  const groupUUID = useCurrentGroupUUID() ?? '';
  const selectedGroupActorUUID = useSelectedGroupActorUUID(groupUUID);
  const selfGroupActors = useSelfGroupActors(groupUUID);
  const dispatch = useTRPGDispatch();
  const { t } = useTranslation();

  const handleChange = useCallback(
    (value: string) => {
      if (value !== selectedGroupActorUUID) {
        dispatch(changeSelectGroupActor(groupUUID, value ?? null));
      }
    },
    [groupUUID, selectedGroupActorUUID]
  );

  return (
    <Select
      placeholder={t('请选择人物卡')}
      style={{ width: 200 }}
      allowClear={true}
      value={selectedGroupActorUUID}
      onChange={handleChange}
    >
      {(selfGroupActors ?? []).map((actor) => (
        <Option key={actor.uuid} value={actor.uuid}>
          {actor.name}
        </Option>
      ))}
    </Select>
  );
});
GroupActorSelector.displayName = 'GroupActorSelector';
