import constants from '@shared/redux/constants';
const { UPDATE_ACTOR_SUCCESS } = constants;

import { TRPGAction } from '@redux/types/__all__';
import {
  showLoading,
  showAlert,
  hideLoading,
  hideAlert,
  hideModal,
} from '@redux/actions/ui';
import _isString from 'lodash/isString';
import _set from 'lodash/set';
import config from '@shared/project.config';
import { isBlobUrl } from '@shared/utils/string-helper';
import { toAvatarWithBlobUrl } from '@web/utils/upload-helper';

import * as trpgApi from '@shared/api/trpg.api';
const api = trpgApi.getInstance();

/**
 * 根据UUID更新角色信息
 * @param uuid 角色唯一标识
 * @param name 角色名
 * @param avatar 角色头像
 * @param desc 角色描述
 * @param info 角色信息
 */
export function updateActor(
  uuid: string,
  name: string,
  avatar: string,
  desc: string,
  info: {}
): TRPGAction {
  return async function(dispatch, getState) {
    dispatch(showLoading('正在更新人物卡信息，请稍后...'));
    if (_isString(avatar) && isBlobUrl(avatar)) {
      // 如果avatar是blob url的话, 则上传一下
      const userUUID = getState().user.info.uuid;
      try {
        const { url } = await toAvatarWithBlobUrl(userUUID, avatar);
        // 上传成功后更新属性
        _set(info, '_avatar', url);
        avatar = url;
      } catch (err) {
        dispatch(hideLoading());
        dispatch(showAlert('上传头像失败'));
        throw err;
      }
    }

    return api.emit(
      'actor::updateActor',
      { uuid, name, avatar, desc, info },
      function(data) {
        dispatch(hideLoading());
        dispatch(hideAlert());
        dispatch(hideModal());
        if (data.result) {
          let actor = data.actor;
          actor.avatar = config.file.getAbsolutePath(actor.avatar);
          dispatch({ type: UPDATE_ACTOR_SUCCESS, payload: actor });
        } else {
          dispatch(showAlert(data.msg));
          console.error(data.msg);
        }
      }
    );
  };
}
