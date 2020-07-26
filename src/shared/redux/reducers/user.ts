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
  SET_WEB_TOKEN,
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
  webToken: null,
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
    case LOGIN_SUCCESS:
    case LOGIN_TOKEN_SUCCESS:
      draft.isLogin = true;
      draft.isTryLogin = false;
      draft.info = action.payload;
      return;
    case LOGIN_FAILED:
      draft.isLogin = false;
      draft.isTryLogin = false;
      draft.info = {};
      return;
    case LOGOUT:
      // sessionStorage.remove('uuid').remove('token');
      draft.isLogin = false;
      draft.info = {};
      return;
    case REGISTER_REQUEST:
    case REGISTER_FAILED:
    case REGISTER_SUCCESS:
      return;
    case SET_WEB_TOKEN:
      draft.webToken = action.token ?? null;
      return;
    case FIND_USER_REQUEST:
      draft.isFindingUser = false;
      return;
    case FIND_USER_SUCCESS:
    case FIND_USER_FAILED:
      draft.isFindingUser = false;
      draft.findingResult = action.payload || [];
      return;
    case UPDATE_INFO_SUCCESS:
      draft.info = action.payload;
      return;
    case ADD_FRIEND_SUCCESS: {
      const friendUUID = action.friendUUID;
      if (!draft.friendList.includes(friendUUID)) {
        draft.friendList.push(friendUUID);
      }
      return;
    }
    case GET_FRIENDS_SUCCESS:
      draft.friendList = action.payload;
      return;
    case SEND_FRIEND_INVITE_SUCCESS: {
      const payload = action.payload;

      const notExist =
        draft.friendInvite.findIndex((inv) => inv.uuid === payload.uuid) === -1;
      if (notExist) {
        draft.friendInvite.push(payload);
      }
      return;
    }
    case GET_FRIEND_INVITE_SUCCESS:
      draft.friendInvite = action.payload.invites ?? [];
      draft.friendRequests = action.payload.requests ?? [];
      return;
    case AGREE_FRIEND_INVITE_SUCCESS: {
      const agreeUUID = action.payload.uuid;
      _remove(draft.friendRequests, (r) => r.uuid === agreeUUID);
      draft.friendList.push(action.payload.from_uuid);
      return;
    }
    case REFUSE_FRIEND_INVITE_SUCCESS: {
      const refuseUUID = action.payload.uuid;
      _remove(draft.friendRequests, (r) => r.uuid === refuseUUID);
      return;
    }
    case ADD_FRIEND_INVITE:
      draft.friendRequests.push(action.payload);
      return;
  }
}, initialState);
