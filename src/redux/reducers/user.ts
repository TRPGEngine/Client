import immutable from 'immutable';
import constants from '../constants';
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

const initialState = immutable.fromJS({
  isTryLogin: false,
  isLogin: false,
  info: {},
  friendList: [],
  friendInvite: [], // 好友邀请(发送的)
  friendRequests: [], // 好友申请(接受到的)
  isFindingUser: false, // 好友查询页面
  findingResult: [],
});

export default function ui(state = initialState, action) {
  switch (action.type) {
    case RESET:
      return initialState;
    case LOGIN_REQUEST:
      return state.set('isTryLogin', true);
    case LOGIN_SUCCESS:
    case LOGIN_TOKEN_SUCCESS:
      // let {uuid, token} = action.payload;
      // sessionStorage.set({uuid, token});
      return state
        .set('isLogin', true)
        .set('isTryLogin', false)
        .set('info', immutable.fromJS(action.payload));
    case LOGIN_FAILED:
      return state
        .set('isLogin', false)
        .set('isTryLogin', false)
        .set('info', immutable.Map());
    case LOGOUT:
      // sessionStorage.remove('uuid').remove('token');
      return state.set('isLogin', false).set('info', immutable.Map());
    case REGISTER_REQUEST:
    case REGISTER_FAILED:
    case REGISTER_SUCCESS:
      return state;
    case FIND_USER_REQUEST:
      return state.set('isFindingUser', true);
    case FIND_USER_SUCCESS:
    case FIND_USER_FAILED:
      return state
        .set('isFindingUser', false)
        .set('findingResult', immutable.fromJS(action.payload || []));
    case UPDATE_INFO_SUCCESS:
      return state.set('info', immutable.fromJS(action.payload));
    case ADD_FRIEND_SUCCESS: {
      let friendUUID = action.friendUUID;
      return state.update('friendList', (list) => {
        if (list.indexOf(friendUUID) === -1) {
          return list.push(friendUUID);
        } else {
          return list;
        }
      });
    }
    case GET_FRIENDS_SUCCESS:
      return state.set('friendList', immutable.fromJS(action.payload));
    case SEND_FRIEND_INVITE_SUCCESS:
      return state.update('friendInvite', (list) => {
        let toUUID = action.uuid;
        if (list.indexOf(toUUID) === -1) {
          return list.push(toUUID);
        } else {
          return list;
        }
      });
    case GET_FRIEND_INVITE_SUCCESS:
      return state.set(
        'friendRequests',
        immutable.fromJS(action.payload || [])
      );
    case AGREE_FRIEND_INVITE_SUCCESS:
      return state
        .update('friendRequests', (list) => {
          let agreeUUID = action.payload.uuid;
          let index = -1;
          for (let i = 0; i < list.count(); i++) {
            let item = list.get(i);
            if (item.get('uuid') === agreeUUID) {
              index = i;
              break;
            }
          }

          if (index >= 0) {
            return list.delete(index);
          } else {
            return list;
          }
        })
        .update('friendList', (list) => list.push(action.payload.from_uuid));
    case REFUSE_FRIEND_INVITE_SUCCESS:
      return state.update('friendRequests', (list) => {
        // same as agree
        let agreeUUID = action.payload.uuid;
        let index = -1;
        for (let i = 0; i < list.count(); i++) {
          let item = list.get(i);
          if (item.get('uuid') === agreeUUID) {
            index = i;
            break;
          }
        }

        if (index >= 0) {
          return list.delete(index);
        } else {
          return list;
        }
      });
    case ADD_FRIEND_INVITE:
      return state.update('friendRequests', (list) =>
        list.push(immutable.fromJS(action.payload))
      );
    default:
      return state;
  }
}
