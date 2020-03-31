import constants from '../constants';
import { ActorState } from '@redux/types/actor';
import { produce } from 'immer';
import _remove from 'lodash/remove';
import _find from 'lodash/find';
import _isNil from 'lodash/isNil';
const {
  RESET,
  GET_TEMPLATE_SUCCESS,
  GET_SUGGEST_TEMPLATES_SUCCESS,
  FIND_TEMPLATE_SUCCESS,
  SET_EDITED_TEMPLATE,
  SELECT_TEMPLATE,
  CREATE_ACTOR_SUCCESS,
  GET_ACTOR_SUCCESS,
  SELECT_ACTOR,
  REMOVE_ACTOR_SUCCESS,
  UPDATE_ACTOR_SUCCESS,
  SHARE_ACTOR_SUCCESS,
  UNSHARE_ACTOR_SUCCESS,
  FORK_ACTOR_SUCCESS,
} = constants;

const initialState: ActorState = {
  isFindingTemplate: false, // 模板查询页面
  suggestTemplate: [], // 系统推荐模板列表
  findingResult: [], // 模板查询结果
  currentEditedTemplate: {
    uuid: '',
    name: '模板名',
    desc: '',
    avatar: '',
    info: '',
  },
  selfTemplate: [],
  selectedTemplate: {},
  selfActors: [],
  selectedActorUUID: '', // selected actor UUID
};

export default produce((draft: ActorState, action) => {
  switch (action.type) {
    case RESET:
      return initialState;
    case GET_SUGGEST_TEMPLATES_SUCCESS:
      draft.suggestTemplate = action.payload;
      return;
    case FIND_TEMPLATE_SUCCESS:
      draft.findingResult = action.payload;
      return;
    case GET_TEMPLATE_SUCCESS:
      if (action.uuid) {
        const i = draft.selfTemplate.findIndex(
          (item) => item.uuid === action.uuid
        );
        if (i >= 0) {
          draft.selfTemplate[i] = action.payload;
        }
      } else {
        draft.selfTemplate = action.payload;
      }
      return;
    case SET_EDITED_TEMPLATE:
      draft.currentEditedTemplate = action.payload;
      return;
    case SELECT_TEMPLATE:
      draft.selectedTemplate = action.payload;
      return;
    case CREATE_ACTOR_SUCCESS:
      draft.selfActors.push(action.payload);
      draft.selectedActorUUID = '';
      return;
    case GET_ACTOR_SUCCESS:
      if (action.uuid) {
        const i = draft.selfActors.findIndex(
          (item) => item.uuid === action.uuid
        );
        if (i >= 0) {
          draft.selfActors[i] = action.payload;
        }
      } else {
        draft.selfActors = action.payload;
      }
      return;
    case SELECT_ACTOR:
      draft.selectedActorUUID = action.payload;
      return;
    case REMOVE_ACTOR_SUCCESS:
      _remove(draft.selfActors, (item) => item.uuid === action.uuid);
      return;
    case UPDATE_ACTOR_SUCCESS:
      const i = draft.selfActors.findIndex(
        (item) => item.uuid === action.payload.uuid
      );
      if (i >= 0) {
        draft.selfActors[i] = action.payload;
      }
      return;
    case SHARE_ACTOR_SUCCESS: {
      const actorUUID = action.payload.actorUUID;
      const actor = _find(draft.selfActors, ['uuid', actorUUID]);
      if (!_isNil(actor)) {
        actor.shared = true;
      }
      return;
    }
    case UNSHARE_ACTOR_SUCCESS: {
      const actorUUID = action.payload.actorUUID;
      const actor = _find(draft.selfActors, ['uuid', actorUUID]);
      if (!_isNil(actor)) {
        actor.shared = false;
      }
      return;
    }
    case FORK_ACTOR_SUCCESS: {
      const actor = action.payload.actor;
      if (!_isNil(actor)) {
        draft.selfActors.push(actor);
      }
      return;
    }
  }
}, initialState);
