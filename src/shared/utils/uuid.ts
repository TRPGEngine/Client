import { anyNonNil, v1, v4 } from 'is-uuid';

/**
 * 判定是否为一个UUID
 */
export function isUUID(uuid = ''): uuid is string {
  return anyNonNil(uuid);
}

/**
 * 检查是否为用户UUID
 */
export const isUserUUID = (uuid: string): boolean => {
  return v1(uuid);
};

/**
 * 检查是否为用户或者团UUID
 */
export const isUserOrGroupUUID = (uuid: string): boolean => {
  return v1(uuid);
};

/**
 * 检查该条消息是否为本地消息
 * @param uuid 消息UUID
 */
export const isLocalMsgUUID = (uuid: string): boolean => {
  return uuid.startsWith('local#');
};
