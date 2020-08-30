import React, { useCallback } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { Select } from 'antd';
import {
  useSelfGroupActors,
  useSelectedGroupActorUUID,
} from '@redux/hooks/group';
import { useTRPGDispatch } from '@shared/hooks/useTRPGSelector';
import { changeSelectGroupActor } from '@redux/actions/group';
const Option = Select.Option;

interface GroupActorSelectorProps {
  groupUUID: string;
}
export const GroupActorSelector: React.FC<GroupActorSelectorProps> = TMemo(
  (props) => {
    const { groupUUID } = props;
    const selectedGroupActorUUID = useSelectedGroupActorUUID(groupUUID);
    const selfGroupActors = useSelfGroupActors(groupUUID);
    const dispatch = useTRPGDispatch();

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
        placeholder="请选择人物卡"
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
  }
);
GroupActorSelector.displayName = 'GroupActorSelector';
