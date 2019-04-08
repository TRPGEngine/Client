import * as isUUID from 'is-uuid';

export const isUserUUID = (uuid) => {
  return isUUID.v1(uuid);
};
export const isGroupUUID = (uuid) => {
  return isUUID.v4(uuid);
};
