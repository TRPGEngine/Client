import { anyNonNil, v1, v4 } from 'is-uuid';

/**
 * 判定是否为一个UUID
 */
export function isUUID(uuid = ''): uuid is string {
  return anyNonNil(uuid);
}

export const isUserUUID = (uuid: string) => {
  return v1(uuid);
};

export const isUserOrGroupUUID = (uuid: string) => {
  return v1(uuid);
};
