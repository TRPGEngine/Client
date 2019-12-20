import { getStoreState } from '@redux/configureStore/helper';
import { List } from 'immutable';

/**
 * 获取当前选择的团角色的角色信息
 */
export function getCurrentGroupActor(groupUUID: string) {
  const state = getStoreState();

  const groupInfo = state
    .getIn(['group', 'groups'])
    .find((group) => group.get('uuid') === groupUUID);
  const selfActors: List<string> = state
    .getIn(['actor', 'selfActors'])
    .map((i) => i.get('uuid'));
  const selfGroupActors = groupInfo
    .get('group_actors', List())
    .filter(
      (i) => i.get('enabled') && selfActors.includes(i.get('actor_uuid'))
    );
  const selectedGroupActorUUID = groupInfo.getIn([
    'extra',
    'selected_group_actor_uuid',
  ]);
  const currentGroupActorInfo = selfGroupActors.find(
    (actor) => actor.get('uuid') === selectedGroupActorUUID
  );
  return currentGroupActorInfo;
}
