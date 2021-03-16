import constants from '@redux/constants';
import type { UserState } from '@redux/types/user';
import _remove from 'lodash/remove';
import { createReducer } from '@reduxjs/toolkit';
import {
  loginSuccess,
  removeFriendInvite,
  setLogout,
} from '@redux/actions/user';
import { resetCreator } from '@redux/actions/__shared__';

const {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  LOGIN_TOKEN_SUCCESS,
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

export default createReducer(initialState, (builder) => {
  builder
    .addCase(resetCreator, (state) => {
      state = initialState;
    })
    .addCase(LOGIN_REQUEST, (state) => {
      state.isTryLogin = true;
    })
    .addCase(loginSuccess.fulfilled, (state, action) => {
      state.isLogin = true;
      state.isTryLogin = false;
      state.info = action.payload.info;
    })
    .addCase(LOGIN_TOKEN_SUCCESS, (state, action: any) => {
      state.isLogin = true;
      state.isTryLogin = false;
      state.info = action.payload;
    })
    .addCase(LOGIN_FAILED, (state) => {
      state.isLogin = false;
      state.isTryLogin = false;
      state.info = {};
    })
    .addCase(setLogout, (state) => {
      state.isLogin = false;
      state.info = {};
    })
    .addCase(SET_WEB_TOKEN, (state, action: any) => {
      state.webToken = action.token ?? null;
    })
    .addCase(FIND_USER_REQUEST, (state) => {
      state.isFindingUser = false;
    })
    .addCase(FIND_USER_SUCCESS, (state, action: any) => {
      state.isFindingUser = false;
      state.findingResult = action.payload || [];
    })
    .addCase(FIND_USER_FAILED, (state, action: any) => {
      state.isFindingUser = false;
      state.findingResult = action.payload || [];
    })
    .addCase(UPDATE_INFO_SUCCESS, (state, action: any) => {
      state.info = action.payload;
    })
    .addCase(ADD_FRIEND_SUCCESS, (state, action: any) => {
      const friendUUID = action.friendUUID;
      if (!state.friendList.includes(friendUUID)) {
        state.friendList.push(friendUUID);
      }

      // 检查一下移除好友请求与好友邀请
      _remove(state.friendInvite, (item) => item.to_uuid === friendUUID); // 好友邀请的to_uuid是目标的UUID
      _remove(state.friendRequests, (item) => item.from_uuid === friendUUID); // 好友请求的from_uuid是目标的UUID
    })
    .addCase(GET_FRIENDS_SUCCESS, (state, action: any) => {
      state.friendList = action.payload;
    })
    .addCase(SEND_FRIEND_INVITE_SUCCESS, (state, action: any) => {
      const payload = action.payload;

      const notExist =
        state.friendInvite.findIndex((inv) => inv.uuid === payload.uuid) === -1;
      if (notExist) {
        state.friendInvite.push(payload);
      }
    })
    .addCase(GET_FRIEND_INVITE_SUCCESS, (state, action: any) => {
      state.friendInvite = action.payload.invites ?? [];
      state.friendRequests = action.payload.requests ?? [];
    })
    .addCase(AGREE_FRIEND_INVITE_SUCCESS, (state, action: any) => {
      const agreeUUID = action.payload.uuid;
      _remove(state.friendRequests, (r) => r.uuid === agreeUUID);
      state.friendList.push(action.payload.from_uuid);
    })
    .addCase(REFUSE_FRIEND_INVITE_SUCCESS, (state, action: any) => {
      const refuseUUID = action.payload.uuid;
      _remove(state.friendRequests, (r) => r.uuid === refuseUUID);
    })
    .addCase(ADD_FRIEND_INVITE, (state, action: any) => {
      state.friendRequests.push(action.payload);
    })
    .addCase(removeFriendInvite, (state, action) => {
      const { inviteUUID } = action.payload;
      _remove(state.friendInvite, (item) => item.uuid === inviteUUID);
      _remove(state.friendRequests, (item) => item.uuid === inviteUUID);
    });
});
