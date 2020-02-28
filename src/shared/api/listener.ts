import { API } from './socket-api';
import rnStorage from './rn-storage.api';
import constants from '../redux/constants';
import { TRPGStore } from '@redux/types/__all__';
const { RESET, ADD_FRIEND_SUCCESS } = constants;

export function bindEventFunc(
  this: API,
  store: TRPGStore,
  { onReceiveMessage }: any = {}
) {
  const {
    changeNetworkStatue,
    showAlert,
    updateSocketId,
  } = require('../redux/actions/ui');
  const {
    addMsg,
    updateMsg,
    startWriting,
    stopWriting,
  } = require('../redux/actions/chat');
  const { addFriendInvite, loginWithToken } = require('../redux/actions/user');
  const {
    updateGroupStatus,
    addGroup,
    updatePlayerSelectedGroupActor,
    addGroupMember,
    removeGroupMember,
    updateGroupActorInfo,
  } = require('../redux/actions/group');
  const { getUserInfoCache } = require('../utils/cache-helper');

  if (!(this instanceof API)) {
    throw new Error('bindEventFunc shound a API object class');
  }

  const api = this;
  api.on('chat::message', function(data) {
    let converseUUID = data.converse_uuid || data.sender_uuid;
    store.dispatch(addMsg(converseUUID, data));

    onReceiveMessage && onReceiveMessage(data);
  });

  api.on('chat::updateMessage', function(data) {
    let converseUUID = data.converseUUID;
    let payload = data.payload;
    store.dispatch(updateMsg(converseUUID, payload));
  });

  api.on('chat::startWriting', function(data) {
    const { type = 'user', from } = data;
    const uuid = from;
    store.dispatch(startWriting(type, uuid));
  });

  api.on('chat::stopWriting', function(data) {
    const { type = 'user', from } = data;
    const uuid = from;
    store.dispatch(stopWriting(type, uuid));
  });

  api.on('player::appendFriend', function(data) {
    let uuid = data.uuid;
    getUserInfoCache(uuid);
    store.dispatch({ type: ADD_FRIEND_SUCCESS, friendUUID: uuid });
  });
  api.on('player::invite', function(data) {
    store.dispatch(addFriendInvite(data));
  });
  api.on('player::tick', function(data) {
    store.dispatch(showAlert(data.msg));
    store.dispatch({ type: RESET });
  });
  api.on('group::updateGroupStatus', function(data) {
    store.dispatch(updateGroupStatus(data.groupUUID, data.groupStatus));
  });
  api.on('group::addGroupSuccess', function(data) {
    store.dispatch(addGroup(data.group));
  });
  api.on('group::updateGroupActorInfo', function(data) {
    const { groupUUID, groupActorUUID, groupActorInfo } = data;
    store.dispatch(
      updateGroupActorInfo(groupUUID, groupActorUUID, groupActorInfo)
    );
  });
  api.on('group::updatePlayerSelectedGroupActor', function(data) {
    store.dispatch(
      updatePlayerSelectedGroupActor(
        data.groupUUID,
        data.userUUID,
        data.groupActorUUID
      )
    );
  });
  api.on('group::addGroupMember', ({ groupUUID, memberUUID }) => {
    store.dispatch(addGroupMember(groupUUID, memberUUID));
  });
  api.on('group::removeGroupMember', ({ groupUUID, memberUUID }) => {
    store.dispatch(removeGroupMember(groupUUID, memberUUID));
  });

  // 网络状态管理
  api.on('connect', function(data) {
    store.dispatch(changeNetworkStatue(true, '网络连接畅通'));
    store.dispatch(updateSocketId(api.socket.id));
    console.log('连接成功');
  });
  api.on('connecting', function(data) {
    store.dispatch(changeNetworkStatue(false, '正在连接...', true));
    console.log('正在连接');
  });
  api.on('reconnect', function(data) {
    store.dispatch(changeNetworkStatue(true, '网络连接畅通'));
    store.dispatch(updateSocketId(api.socket.id));
    console.log('重连成功');

    const isLogin = store.getState().user.isLogin;
    if (isLogin) {
      (async () => {
        let uuid = await rnStorage.get('uuid');
        let token = await rnStorage.get('token');
        console.log('正在尝试自动重新登录');
        store.dispatch(loginWithToken(uuid, token));
      })();
    }
  });
  api.on('reconnecting', function(data) {
    store.dispatch(changeNetworkStatue(false, '正在连接...', true));
    console.log('重连中...', api.serverUrl);
  });
  api.on('disconnect', function(data) {
    store.dispatch(changeNetworkStatue(false, '已断开连接'));
    console.log('已断开连接');
  });
  api.on('connect_failed', function(data) {
    store.dispatch(changeNetworkStatue(false, '连接失败'));
    console.log('连接失败');
  });
  api.on('error', function(data) {
    store.dispatch(changeNetworkStatue(false, '网络出现异常'));
    console.log('网络出现异常', data);
  });
}
