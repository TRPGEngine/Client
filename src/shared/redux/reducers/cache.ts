import immutable from 'immutable';
import constants from '@redux/constants';
import { CacheState } from '@redux/types/cache';
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
    // return state.setIn(
    //   ['user', action.payload.uuid],
    //   immutable.fromJS(action.payload)
    // );
    case GET_TEMPLATE_INFO:
      draft.template[action.payload.uuid] = action.payload;
      return;
    // return state.setIn(
    //   ['template', action.payload.uuid],
    //   immutable.fromJS(action.payload)
    // );
    case GET_ACTOR_INFO:
      draft.actor[action.payload.uuid] = action.payload;
      return;
    // return state.setIn(
    //   ['actor', action.payload.uuid],
    //   immutable.fromJS(action.payload)
    // );
    case GET_TEMPLATE_SUCCESS:
      if (action.uuid) {
        draft.template[action.payload.uuid] = action.payload;
        // return state.setIn(
        //   ['template', action.payload.uuid],
        //   immutable.fromJS(action.payload)
        // );
      } else {
        for (let template of action.payload) {
          // state = state.setIn(
          //   ['template', template.uuid],
          //   immutable.fromJS(template)
          // );
          draft.template[template.uuid] = template;
        }
      }
      return;
    case GET_GROUP_INFO_SUCCESS:
      draft.group[action.payload.uuid] = action.payload;
      return;
    // return state.setIn(
    //   ['group', action.payload.uuid],
    //   immutable.fromJS(action.payload)
    // );
    case GET_FRIEND_INVITE_INFO:
      draft.friendInvite[action.payload.uuid] = action.payload;
      return;
    // return state.setIn(
    //   ['friendInvite', action.payload.uuid],
    //   immutable.fromJS(action.payload)
    // );
    case GET_GROUP_INVITE_INFO:
      draft.groupInvite[action.payload.uuid] = action.payload;
      return;
    // return state.setIn(
    //   ['groupInvite', action.payload.uuid],
    //   immutable.fromJS(action.payload)
    // );
    // default:
    //   return state;
  }
}, initialState);
