import constants from '@redux/constants';
import type { CacheState } from '@redux/types/cache';
import produce from 'immer';
const {
  RESET,
  GET_USER_INFO,
  GET_TEMPLATE_INFO,
  GET_ACTOR_INFO,
  GET_TEMPLATE_SUCCESS,
  GET_GROUP_INFO_SUCCESS,
  GET_FRIEND_INVITE_INFO,
  GET_GROUP_INVITE_INFO,
} = constants;

const initialState: CacheState = {
  user: {},
  template: {},
  actor: {},
  group: {},
  friendInvite: {},
  groupInvite: {},
};

export default produce((draft: CacheState, action) => {
  switch (action.type) {
    case RESET:
      return initialState;
    case GET_USER_INFO:
      draft.user[action.payload.uuid] = action.payload;
      return;
    case GET_TEMPLATE_INFO:
      draft.template[action.payload.uuid] = action.payload;
      return;
    case GET_ACTOR_INFO:
      draft.actor[action.payload.uuid] = action.payload;
      return;
    case GET_TEMPLATE_SUCCESS:
      if (action.uuid) {
        draft.template[action.payload.uuid] = action.payload;
      } else {
        for (const template of action.payload) {
          draft.template[template.uuid] = template;
        }
      }
      return;
    case GET_GROUP_INFO_SUCCESS:
      draft.group[action.payload.uuid] = action.payload;
      return;
    case GET_FRIEND_INVITE_INFO:
      draft.friendInvite[action.payload.uuid] = action.payload;
      return;
    case GET_GROUP_INVITE_INFO:
      draft.groupInvite[action.payload.uuid] = action.payload;
      return;
  }
}, initialState);
