import isUUID from 'is-uuid';

export default {
  isUserUUID: (uuid) => {
    return isUUID.v1(uuid);
  },
  isGroupUUID: (uuid) => {
    return isUUID.v4(uuid);
  },
};
