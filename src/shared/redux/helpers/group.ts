import { getStoreState } from '@redux/configureStore/helper';
import type { GroupInfo } from '@redux/types/group';
import type { TRPGStore } from '@redux/types/__all__';
import type { GroupPanel } from '@shared/types/panel';
import _get from 'lodash/get';
import _isNil from 'lodash/isNil';
import _compact from 'lodash/compact';
import { isGroupPanelVisible } from '../../helper/group';

/**
 * @deprecated 应当用hook来代替
 * 获取当前选择的团角色的角色信息
 */
export function getCurrentGroupActor(groupUUID: string) {
  const state = getStoreState()!;

  const userUUID = state.user.info.uuid;
  const groupInfo = state.group.groups.find(
    (group) => group.uuid === groupUUID
  );
  const selfGroupActors = (groupInfo?.group_actors ?? []).filter(
    (i) => i.enabled && i.passed && i.owner?.uuid === userUUID
  );
  const selectedGroupActorUUID = _get(groupInfo, [
    'extra',
    'selected_group_actor_uuid',
  ]);

  const currentGroupActorInfo = selfGroupActors.find(
    (actor) => actor.uuid === selectedGroupActorUUID
  );
  return currentGroupActorInfo;
}

/**
 * 根据过滤条件筛选出符合条件的群组面板
 */
function getAllGroupPanelWithFilter(
  store: TRPGStore,
  filter: (group: GroupInfo, panel: GroupPanel) => boolean
) {
  const state = store.getState();
  const groups = state.group.groups;

  const filteredPanel: GroupPanel[] = [];
  groups.forEach((group) => {
    group.panels
      ?.filter((panel) => filter(group, panel))
      .forEach((panel) => {
        filteredPanel.push(panel);
      });
  });

  return filteredPanel;
}

/**
 * 获取所有隐藏群组会话的会话列表
 * 用于在一些场合下阻止默认行为
 */
export function getAllHiddenGroupConverses(store: TRPGStore): string[] {
  const state = store.getState();
  const currentUserUUID = _get(state, ['user', 'info', 'uuid']);
  if (_isNil(currentUserUUID)) {
    return [];
  }

  const allHiddenGroupConverseUUIDs = _compact(
    getAllGroupPanelWithFilter(
      store,
      (group, panel) => !isGroupPanelVisible(group, panel, currentUserUUID)
    ).map((panel) => panel.target_uuid)
  );

  return allHiddenGroupConverseUUIDs;
}
