import constants from '../constants';
const {
  GET_TEMPLATE_SUCCESS,
  GET_SUGGEST_TEMPLATES_SUCCESS,
  FIND_TEMPLATE_SUCCESS,
  SET_EDITED_TEMPLATE,
  SELECT_TEMPLATE,
  CREATE_ACTOR_SUCCESS,
  GET_ACTOR_SUCCESS,
  SELECT_ACTOR,
  REMOVE_ACTOR_SUCCESS,
  SHARE_ACTOR_SUCCESS,
  UNSHARE_ACTOR_SUCCESS,
  FORK_ACTOR_SUCCESS,
} = constants;
import config from '../../project.config';
import { checkTemplate } from '../../utils/cache-helper';
import {
  showLoading,
  hideLoading,
  showAlert,
  hideAlert,
  hideModal,
} from './ui';
import _isUndefined from 'lodash/isUndefined';
import _isString from 'lodash/isString';
import _set from 'lodash/set';
import _isNil from 'lodash/isNil';

import type { TRPGAction } from '@redux/types/__all__';

import * as trpgApi from '../../api/trpg.api';
import rnStorage from '@shared/api/rn-storage.api';
import { showToasts } from '@shared/manager/ui';
const api = trpgApi.getInstance();

export function setTemplate(uuid, name, desc, avatar, info) {
  return {
    uuid,
    name,
    desc,
    avatar,
    info,
  };
}

export function getTemplate(uuid?: string) {
  return function (dispatch, getState) {
    return api.emit('actor::getTemplate', { uuid }, function (data) {
      if (data.result) {
        const payload = uuid ? data.template : data.templates;
        dispatch({ type: GET_TEMPLATE_SUCCESS, uuid, payload });
      } else {
        console.error(data.msg);
      }
    });
  };
}

/**
 * 获取推荐模板
 * 只获取一次，如果之前获取过则不再重复获取
 */
export function getSuggestTemplate(): TRPGAction {
  const cacheKey = 'cache$suggestTemplate';

  return async function (dispatch, getState) {
    if (getState().actor.suggestTemplate.length > 0) {
      return;
    }

    // 先尝试从storage中获取
    try {
      const cache = await rnStorage.get(cacheKey);
      if (!_isNil(cache)) {
        dispatch({ type: GET_SUGGEST_TEMPLATES_SUCCESS, payload: cache });
        return;
      }
    } catch (err) {}

    // 没有的话再发请求
    const data = await api.emitP('actor::getSuggestTemplate', {});

    if (data.result) {
      dispatch({
        type: GET_SUGGEST_TEMPLATES_SUCCESS,
        payload: data.templates || [],
      });
      rnStorage.set(cacheKey, data.templates); // 添加到缓存中
    } else {
      showToasts(data.msg);
    }
  };
}

export function findTemplate(searchName) {
  return function (dispatch, getState) {
    return api.emit('actor::findTemplate', { name: searchName }, function (
      data
    ) {
      console.log(data);
      if (data.result) {
        dispatch({ type: FIND_TEMPLATE_SUCCESS, payload: data.templates });
      } else {
        console.error(data.msg);
      }
    });
  };
}

export function setEditedTemplate(obj) {
  return { type: SET_EDITED_TEMPLATE, payload: obj };
}

export function selectTemplate(template) {
  return { type: SELECT_TEMPLATE, payload: template };
}

/**
 * 创建人物
 * NOTICE: 创建人物前需先上传人物卡头像
 * @param name 人物卡名
 * @param avatar 人物卡头像地址
 * @param desc 人物卡描述
 * @param info 人物卡信息
 * @param template_uuid 人物卡关联模板
 */
export function createActor(
  name: string,
  avatar: string,
  desc: string,
  info: {},
  template_uuid: string,
  avatar_uuid?: string
) {
  return function (dispatch, getState) {
    dispatch(showLoading('创建人物中，请稍后...'));
    return api.emit(
      'actor::createActor',
      { name, avatar, desc, info, template_uuid },
      function (data) {
        dispatch(hideLoading());
        dispatch(hideAlert());
        dispatch(hideModal());
        if (data.result) {
          const actor = data.actor;
          actor.avatar = config.file.getAbsolutePath!(actor.avatar);

          if (actor.avatar !== '' && !_isUndefined(avatar_uuid)) {
            // 创建完毕后绑定头像关系
            api.emit('file::bindAttachUUID', {
              avatar_uuid,
              attach_uuid: actor.uuid,
            });
          }

          dispatch({ type: CREATE_ACTOR_SUCCESS, payload: actor });
        } else {
          dispatch(showAlert(data.msg));
          console.error(data.msg);
        }
      }
    );
  };
}

export function getActor(uuid = '') {
  return function (dispatch, getState) {
    return api.emit('actor::getActor', { uuid }, function (data) {
      if (data.result) {
        const payload = uuid ? data.actor : data.actors;
        if (data.actors) {
          for (const i of payload) {
            i.avatar = config.file.getAbsolutePath!(i.avatar);
            checkTemplate(i.template_uuid);
          }
        } else if (data.actor) {
          payload.avatar = config.file.getAbsolutePath!(payload.avatar);
          checkTemplate(payload.template_uuid);
        }
        dispatch({ type: GET_ACTOR_SUCCESS, uuid, payload });
      } else {
        console.error(data.msg);
      }
    });
  };
}

export function selectActor(uuid) {
  return { type: SELECT_ACTOR, payload: uuid };
}

export function removeActor(uuid) {
  return function (dispatch, getState) {
    return api.emit('actor::removeActor', { uuid }, function (data) {
      dispatch(hideAlert());
      if (data.result) {
        dispatch({ type: REMOVE_ACTOR_SUCCESS, uuid });
      } else {
        dispatch(showAlert(data.msg));
        console.error(data.msg);
      }
    });
  };
}

/**
 * 分享人物卡
 * @param actorUUID 想分享的人物卡的UUID
 */
export function shareActor(actorUUID: string): TRPGAction {
  return function (dispatch, getState) {
    return api.emit('actor::shareActor', { actorUUID }, function (data) {
      if (data.result) {
        dispatch({
          type: SHARE_ACTOR_SUCCESS,
          payload: {
            actorUUID,
          },
        });
        dispatch(hideAlert());
      } else {
        dispatch(showAlert(data.msg));
      }
    });
  };
}

/**
 * 取消分享人物卡
 * @param actorUUID 想取消分享的人物卡的UUID
 */
export function unshareActor(actorUUID: string): TRPGAction {
  return function (dispatch, getState) {
    return api.emit('actor::unshareActor', { actorUUID }, function (data) {
      if (data.result) {
        dispatch({
          type: UNSHARE_ACTOR_SUCCESS,
          payload: {
            actorUUID,
          },
        });
        dispatch(hideAlert());
      } else {
        dispatch(showAlert(data.msg));
      }
    });
  };
}

/**
 * fork人物卡
 * @param targetActorUUID 想fork的人物卡的UUID
 */
export function forkActor(targetActorUUID: string): TRPGAction {
  return function (dispatch, getState) {
    return api.emit('actor::forkActor', { targetActorUUID }, function (data) {
      if (data.result) {
        const actor = data.actor;
        dispatch({
          type: FORK_ACTOR_SUCCESS,
          payload: {
            actor,
          },
        });
        dispatch(hideModal());
        dispatch(
          showAlert(`Fork 人物卡[${actor.name}]成功, 请在人物卡列表中查看`)
        );
      } else {
        dispatch(showAlert(data.msg));
      }
    });
  };
}
