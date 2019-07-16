import immutable, { Record, Map } from 'immutable';
import constants from '../constants';
const {
  RESET,
  GET_USER_INFO,
  GET_TEMPLATE_INFO,
  GET_ACTOR_INFO,
  GET_TEMPLATE_SUCCESS,
  GET_GROUP_INFO_SUCCESS,
} = constants;

export type CacheState = Record<{
  user: Map<string, any>;
  template: Map<string, any>;
  actor: Map<string, any>;
  group: Map<string, any>;
}>;

const initialState: CacheState = immutable.fromJS({
  user: {},
  template: {},
  actor: {},
  group: {},
});

export default function cache(state = initialState, action) {
  switch (action.type) {
    case RESET:
      return initialState;
    case GET_USER_INFO:
      return state.setIn(
        ['user', action.payload.uuid],
        immutable.fromJS(action.payload)
      );
    case GET_TEMPLATE_INFO:
      return state.setIn(
        ['template', action.payload.uuid],
        immutable.fromJS(action.payload)
      );
    case GET_ACTOR_INFO:
      return state.setIn(
        ['actor', action.payload.uuid],
        immutable.fromJS(action.payload)
      );
    case GET_TEMPLATE_SUCCESS:
      if (action.uuid) {
        return state.setIn(
          ['template', action.payload.uuid],
          immutable.fromJS(action.payload)
        );
      } else {
        for (let template of action.payload) {
          state = state.setIn(
            ['template', template.uuid],
            immutable.fromJS(template)
          );
        }
        return state;
      }
    case GET_GROUP_INFO_SUCCESS:
      return state.setIn(
        ['group', action.payload.uuid],
        immutable.fromJS(action.payload)
      );
    default:
      return state;
  }
}
