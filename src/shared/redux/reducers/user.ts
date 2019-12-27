import constants from '@redux/constants';
import { UserState } from '@redux/types/user';
import produce from 'immer';
import _remove from 'lodash/remove';

const {
  RESET,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  LOGIN_TOKEN_SUCCESS,
  LOGOUT,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILED,
  FIND_USER_REQUEST,
  FIND_USER_SUCCESS,
  FIND_USER_FAILED,
  UPDATE_INFO_SUCCESS,
  ADD_FRIEND_SUCCESS,
  GET_FRIENDS_SUCCESS,
  SEND_FRIEND_INVITE_SUCCESS,
  AGREE_FRIEND_INVITE_SUCCESS,
  GET_FRIEND_INVITE_SUCCESS,
  REFUSE_FRIEND_INVITE_SUCCESS,
  ADD_FRIEND_INVITE,
} = constants;

const initialState: UserState = {
  isTryLogin: false,
  isLogin: false,
  info: {},
  friendList: [],
  friendInvite: [], // 好友邀请(发送的)
  friendRequests: [], // 好友申请(接受到的)
  isFindingUser: false, // 好友查询页面
  findingResult: [],
};

export default produce((draft: UserState, action) => {
  switch (action.type) {
    case RESET:
      return initialState;
    case LOGIN_REQUEST:
      draft.isTryLogin = true;
      return;
    // return state.set('isTryLogin', true);
    case LOGIN_SUCCESS:
    case LOGIN_TOKEN_SUCCESS:
      // let {uuid, token} = action.payload;
      // sessionStorage.set({uuid, token});
      draft.isLogin = true;
      draft.isTryLogin = false;
      draft.info = action.payload;
      return;
    // return state
    //   .set('isLogin', true)
    //   .set('isTryLogin', false)
    //   .set('info', immutable.fromJS(action.payload));
    case LOGIN_FAILED:
      draft.isLogin = false;
      draft.isTryLogin = false;
      draft.info = {};
      return;
    // return state
    //   .set('isLogin', false)
    //   .set('isTryLogin', false)
    //   .set('info', immutable.fromJS({}));
    case LOGOUT:
      // sessionStorage.remove('uuid').remove('token');
      draft.isLogin = false;
      draft.info = {};
      return;
    // return state.set('isLogin', false).set('info', immutable.fromJS({}));
    case REGISTER_REQUEST:
    case REGISTER_FAILED:
    case REGISTER_SUCCESS:
      return;
    case FIND_USER_REQUEST:
      draft.isFindingUser = false;
      return;
    // return state.set('isFindingUser', true);
    case FIND_USER_SUCCESS:
    case FIND_USER_FAILED:
      draft.isFindingUser = false;
      draft.findingResult = action.payload || [];
      return;
    // return state
    //   .set('isFindingUser', false)
    //   .set('findingResult', immutable.fromJS(action.payload || []));
    case UPDATE_INFO_SUCCESS:
      draft.info = action.payload;
      return;
    // return state.set('info', immutable.fromJS(action.payload));
    case ADD_FRIEND_SUCCESS: {
      const friendUUID = action.friendUUID;
      if (!draft.friendList.includes(friendUUID)) {
        draft.friendList.push(friendUUID);
      }
      return;

      // return state.update('friendList', (list) => {
      //   if (list.indexOf(friendUUID) === -1) {
      //     return list.push(friendUUID);
      //   } else {
      //     return list;
      //   }
      // });
    }
    case GET_FRIENDS_SUCCESS:
      draft.friendList = action.payload;
      return;
    // return state.set('friendList', immutable.fromJS(action.payload));
    case SEND_FRIEND_INVITE_SUCCESS: {
      const toUUID = action.uuid;
      if (!draft.friendInvite.includes(toUUID)) {
        draft.friendInvite.push(toUUID);
      }
      return;
      // return state.update('friendInvite', (list) => {
      //   let toUUID = action.uuid;
      //   if (list.indexOf(toUUID) === -1) {
      //     return list.push(toUUID);
      //   } else {
      //     return list;
      //   }
      // });
    }
    case GET_FRIEND_INVITE_SUCCESS:
      draft.friendRequests = action.payload || [];
      return;
    // return state.set(
    //   'friendRequests',
    //   immutable.fromJS(action.payload || [])
    // );
    case AGREE_FRIEND_INVITE_SUCCESS: {
      const agreeUUID = action.payload.uuid;
      _remove(draft.friendRequests, (r) => r.uuid === agreeUUID);
      draft.friendList.push(action.payload.from_uuid);
      return;

      // return state
      //   .update('friendRequests', (list) => {
      //     let agreeUUID = action.payload.uuid;
      //     let index = -1;
      //     for (let i = 0; i < list.count(); i++) {
      //       let item = list.get(i);
      //       if (item.get('uuid') === agreeUUID) {
      //         index = i;
      //         break;
      //       }
      //     }

      //     if (index >= 0) {
      //       return list.delete(index);
      //     } else {
      //       return list;
      //     }
      //   })
      //   .update('friendList', (list) => list.push(action.payload.from_uuid));
    }
    case REFUSE_FRIEND_INVITE_SUCCESS: {
      const refuseUUID = action.payload.uuid;
      _remove(draft.friendRequests, (r) => r.uuid === refuseUUID);
      return;

      // return state.update('friendRequests', (list) => {
      //   // same as agree
      //   let agreeUUID = action.payload.uuid;
      //   let index = -1;
      //   for (let i = 0; i < list.count(); i++) {
      //     let item = list.get(i);
      //     if (item.get('uuid') === agreeUUID) {
      //       index = i;
      //       break;
      //     }
      //   }

      //   if (index >= 0) {
      //     return list.delete(index);
      //   } else {
      //     return list;
      //   }
      // });
    }
    case ADD_FRIEND_INVITE:
      draft.friendRequests.push(action.payload);
      return;
    // return state.update('friendRequests', (list) =>
    //   list.push(immutable.fromJS(action.payload))
    // );
  }
}, initialState);
