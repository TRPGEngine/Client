const isUUID = require('is-uuid');

module.exports = {
  isUserUUID: (uuid) => {
    return isUUID.v1(uuid);
  },
  isGroupUUID: (uuid) => {
    return isUUID.v4(uuid);
  },
};
