import { GroupActorType } from '@src/shared/redux/types/group';
import _get from 'lodash/get';

/**
 * 获取团人物卡字段
 * @param groupActor 团人物卡
 * @param field 字段名
 */
export const getGroupActorField = (
  groupActor: GroupActorType,
  field: 'avatar' | 'name' | 'desc'
): string => {
  return groupActor[field] || _get(groupActor, ['actor', field]);
};

/**
 * 获取团人物卡信息
 * 为在原始团人物信息的基础上复写团人物信息
 * @param groupActor 团人物卡
 */
export const getGroupActorInfo = (groupActor: GroupActorType): {} => {
  return {
    ..._get(groupActor, 'actor.info', {}),
    ...groupActor.actor_info,
  };
};

/**
 * 获取团人物卡的模板UUID
 * @param groupActor 团人物卡
 */
export const getGroupActorTemplateUUID = (
  groupActor: GroupActorType
): string => {
  return (
    groupActor.actor_template_uuid ?? _get(groupActor, 'actor.template_uuid')
  );
};
