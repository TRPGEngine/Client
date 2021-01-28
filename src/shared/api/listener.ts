import { API } from './socket-api';
import rnStorage from './rn-storage.api';
import constants from '../redux/constants';
import type { TRPGStore } from '@redux/types/__all__';
import {
  changeNetworkStatue,
  showAlert,
  updateSocketId,
} from '@shared/redux/actions/ui';
import {
  addMsg,
  updateMsg,
  startWriting,
  stopWriting,
} from '@shared/redux/actions/chat';
import {
  addFriendInvite,
  loginWithToken,
  removeFriendInvite,
} from '@shared/redux/actions/user';
import {
  updateGroupStatus,
  addGroup,
  updatePlayerSelectedGroupActor,
  addGroupMember,
  removeGroupMember,
  addGroupActor,
  updateGroupActorInfo,
  updateGroupActor,
  updateGroupInfo,
  updateGroupMapList,
  addGroupMap,
  removeGroup,
} from '@shared/redux/actions/group';
import { getUserInfoCache } from '@shared/utils/cache-helper';

const { RESET, ADD_FRIEND_SUCCESS } = constants;

export function bindEventFunc(
  this: API,
  store: TRPGStore,
  { onReceiveMessage }: any = {}
) {
  if (!(this instanceof API)) {
    throw new Error('bindEventFunc shound a API object class');
  }

  const api = this;
  api.on('chat::message', function (data) {
    const converseUUID = data.converse_uuid || data.sender_uuid;
    store.dispatch(addMsg(converseUUID, data));

    onReceiveMessage && onReceiveMessage(data);
  });

  api.on('chat::updateMessage', function (data) {
    const converseUUID = data.converseUUID;
    const payload = data.payload;
    store.dispatch(updateMsg(converseUUID, payload));
  });

  api.on('chat::startWriting', function (data) {
    const { type = 'user', from, groupUUID, channelUUID, currentText } = data;
    const uuid = from;
    store.dispatch(
      startWriting(type, uuid, groupUUID, channelUUID, currentText)
    );
  });

  api.on('chat::stopWriting', function (data) {
    const { type = 'user', from, groupUUID, channelUUID } = data;
    const uuid = from;
    store.dispatch(stopWriting(type, uuid, groupUUID, channelUUID));
  });

  api.on('player::appendFriend', function (data) {
    const uuid = data.uuid;
    getUserInfoCache(uuid);
    store.dispatch({ type: ADD_FRIEND_SUCCESS, friendUUID: uuid });
  });
  api.on('player::invite', function (data) {
    store.dispatch(addFriendInvite(data));
  });
  api.on('player::removeInvite', function (data) {
    const { inviteUUID } = data;
    store.dispatch(removeFriendInvite({ inviteUUID }));
  });
  api.on('player::tick', function (data) {
    store.dispatch(showAlert(data.msg));
    store.dispatch({ type: RESET });
  });
  api.on('group::updateGroupStatus', function (data) {
    store.dispatch(updateGroupStatus(data.groupUUID, data.groupStatus));
  });
  api.on('group::addGroupSuccess', function (data) {
    store.dispatch(addGroup(data.group));
  });
  api.on('group::updateGroupInfo', function (data) {
    const { groupUUID, groupInfo } = data;
    store.dispatch(
      updateGroupInfo({
        ...groupInfo,
        uuid: groupUUID ?? groupInfo.uuid,
      })
    );
  });
  api.on('group::updateGroupActorInfo', function (data) {
    const { groupUUID, groupActorUUID, groupActorInfo } = data;
    store.dispatch(
      updateGroupActorInfo(groupUUID, groupActorUUID, groupActorInfo)
    );
  });
  api.on('group::addGroupActor', function (data) {
    const { groupUUID, groupActor } = data;
    store.dispatch(addGroupActor(groupUUID, groupActor));
  });
  api.on('group::updateGroupActor', function (data) {
    const { groupUUID, groupActor } = data;
    store.dispatch(updateGroupActor(groupUUID, groupActor));
  });
  api.on('group::updatePlayerSelectedGroupActor', function (data) {
    store.dispatch(
      updatePlayerSelectedGroupActor(
        data.groupUUID,
        data.userUUID,
        data.groupActorUUID
      )
    );
  });
  api.on('trpg::updateGroupMaps', function (data) {
    const { groupUUID, groupMaps } = data;
    store.dispatch(updateGroupMapList(groupUUID, groupMaps));
  });
  api.on('trpg::addGroupMap', function (data) {
    const { groupUUID, mapUUID, mapName } = data;
    store.dispatch(addGroupMap(groupUUID, mapUUID, mapName));
  });
  api.on('group::addGroupMember', ({ groupUUID, memberUUID }) => {
    store.dispatch(addGroupMember(groupUUID, memberUUID));
  });
  api.on('group::removeGroupMember', ({ groupUUID, memberUUID }) => {
    store.dispatch(removeGroupMember(groupUUID, memberUUID));
  });
  api.on('group::dismissGroup', ({ groupUUID }) => {
    store.dispatch(removeGroup(groupUUID));
  });

  // ------------------------------------------------

  // 网络状态管理
  api.on('connect', function (data) {
    store.dispatch(changeNetworkStatue(true, '网络连接畅通'));
    store.dispatch(updateSocketId(api.socket.id));
    console.log('连接成功');
  });
  api.on('connecting', function (data) {
    store.dispatch(changeNetworkStatue(false, '正在连接...', true));
    console.log('正在连接');
  });
  api.on('reconnect', function (data) {
    store.dispatch(changeNetworkStatue(true, '重连成功, 网络连接畅通'));
    store.dispatch(updateSocketId(api.socket.id));
    console.log('重连成功');

    const isLogin = store.getState().user.isLogin;
    if (isLogin) {
      // 应当是登录状态
      (async () => {
        const uuid = await rnStorage.get('uuid');
        const token = await rnStorage.get('token');
        console.log('正在尝试自动重新登录');
        if (!!token && !!uuid) {
          store.dispatch(loginWithToken(uuid, token));
        } else {
          console.log('无法自动登录, 因为获取不到相关数据');
        }
      })();
    }
  });
  api.on('reconnecting', function (data) {
    store.dispatch(changeNetworkStatue(false, '正在重新连接...', true));
    console.log('重连中...', API.serviceUrl);
  });
  api.on('disconnect', function (data) {
    store.dispatch(changeNetworkStatue(false, '已断开连接'));
    console.log('已断开连接');
  });
  api.on('connect_failed', function (data) {
    store.dispatch(changeNetworkStatue(false, '连接失败'));
    console.log('连接失败');
  });
  api.on('error', function (data) {
    store.dispatch(changeNetworkStatue(false, '网络出现异常'));
    console.log('网络出现异常', data);
  });
}
