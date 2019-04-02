import io from 'socket.io-client';
import config from '../../config/project.config.js';
import { RESET, ADD_FRIEND_SUCCESS } from '../redux/constants';

import { addMsg, updateMsg } from '../redux/actions/chat';
import { addFriendInvite, loginWithToken } from '../redux/actions/user';
import { updateGroupStatus, addGroup } from '../redux/actions/group';

import { getUserInfoCache } from '../shared/utils/cacheHelper';
import rnStorage from './rnStorage.api.js';

let api = null;
let handleEventError = null;
const platformSocketParam = {
  jsonp: false,
};
function API() {
  this.serverUrl = `${config.io.protocol}://${config.io.host}:${
    config.io.port
  }`;
  this.socket = io(this.serverUrl, platformSocketParam);
  this.emit = (event, data, cb) => {
    if (this.socket.disconnected) {
      this.socket.connect();
    }
    return this.socket.emit(event, data, (res) => {
      cb(res);
      if (res.result === false) {
        // 如果检测到错误则汇报错误信息
        const info = `${res.msg}\n事件: ${event}\n发送信息: ${JSON.stringify(
          data
        )}`;
        handleEventError && handleEventError(info);
      }
    });
  };
  this.on = this.socket.on.bind(this.socket);
}

export function getInstance() {
  if (!api) {
    api = new API();
    console.log('new socket client connect created!');
  }

  return api;
}

export function bindEventFunc(store, { onReceiveMessage } = {}) {
  const {
    changeNetworkStatue,
    showAlert,
    updateSocketId,
  } = require('../redux/actions/ui');

  if (!(this instanceof API)) {
    throw new Error('bindEventFunc shound a API object class');
  }

  let api = this;
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

  api.on('player::addFriend', function(data) {
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

    let isLogin = store.getState().getIn(['user', 'isLogin']);
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

export function setEventErrorHandler(cb) {
  handleEventError = cb;
}

export const fileUrl = config.file.url + '/file';
