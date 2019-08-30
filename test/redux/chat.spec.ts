import chatReducer from '@redux/reducers/chat';
import { fromJS } from 'immutable';

/**
 * 获取初始状态
 */
const getInitState = () => chatReducer(undefined, { type: 'any' });

describe('chat reducer', () => {
  it('init state', () => {
    const state = getInitState();

    // 检查默认参数
    expect(state).toBeImmutable();
    expect(state.get('selectedConversesUUID')).toBe('');
    expect(state.get('conversesDesc')).toBe('');
    expect(state.get('converses')).toBeImmutableMap();
    expect(state.get('writingList')).toBeImmutableMap();
    expect(state.getIn(['writingList', 'user'])).toBeImmutableList();
    expect(state.getIn(['writingList', 'group'])).toBeImmutableMap();
    expect(state.get('emotions')).toBeImmutableMap();
    expect(state.getIn(['emotions', 'catalogs'])).toBeImmutableList();
    expect(state.getIn(['emotions', 'favorites'])).toBeImmutableList();
  });

  it('ADD_CONVERSES', () => {
    const state = chatReducer(undefined, {
      type: 'ADD_CONVERSES',
      payload: {
        uuid: 'test',
        others: 'others',
      },
    });

    expect(state).toBeImmutable();
    expect(state.get('converses')).toBeImmutableMap();
    expect(state.getIn(['converses', 'test'])).toBeImmutableMap();
    expect(state.getIn(['converses', 'test', 'msgList'])).toBeImmutableList();
    expect(typeof state.getIn(['converses', 'test', 'lastMsg'])).toBe('string');
    expect(typeof state.getIn(['converses', 'test', 'lastTime'])).toBe(
      'string'
    );
    expect(state.getIn(['converses', 'test', 'uuid'])).toBe('test');
    expect(state.getIn(['converses', 'test', 'others'])).toBe('others');
  });

  it('ADD_MSG', () => {
    const date = new Date().toISOString();
    const logFn = (console.warn = jest.fn());
    const state = chatReducer(undefined, {
      type: 'ADD_MSG',
      converseUUID: 'test',
      payload: {
        message: 'any',
        date,
      },
    });

    expect(state).toBe(getInitState());
    expect(logFn.mock.calls.length).toBe(1);
    expect(logFn.mock.calls[0][0]).toMatch('this converses is not exist');
    expect(logFn.mock.calls[0][1]).toBe('test');

    const state2 = chatReducer(
      fromJS({
        converses: {
          test: {
            uuid: 'test',
            lastMsg: '',
            lastTime: '',
            msgList: [],
          },
        },
      }),
      {
        type: 'ADD_MSG',
        converseUUID: 'test',
        payload: {
          message: 'any',
          date,
        },
      }
    );

    expect(state2).toBeImmutableMap();
    expect(state2.get('converses')).toBeImmutableMap();
    expect(state2.getIn(['converses', 'test'])).toBeImmutableMap();
    expect(state2.getIn(['converses', 'test', 'msgList'])).toBeImmutableList();
    expect(state2.getIn(['converses', 'test']).toJS()).toMatchObject({
      uuid: 'test',
      lastMsg: 'any',
      lastTime: date,
      msgList: [
        {
          message: 'any',
          date,
        },
      ],
      unread: false,
    });
  });

  it.todo('UPDATE_MSG');
  it.todo('GET_CONVERSES_REQUEST');
  it.todo('GET_CONVERSES_SUCCESS');
  it.todo('GET_USER_CONVERSES_SUCCESS');
  it.todo('UPDATE_CONVERSES_INFO_SUCCESS');
  it.todo('UPDATE_CONVERSES_MSGLIST_SUCCESS');
  it.todo('SWITCH_CONVERSES');
  it.todo('CREATE_CONVERSES_REQUEST');
  it.todo('CREATE_CONVERSES_SUCCESS');
  it.todo('CREATE_CONVERSES_FAILED');
  it.todo('REMOVE_CONVERSES_SUCCESS');
  it.todo('REMOVE_USER_CONVERSE');
  it.todo('SEND_MSG');
  it.todo('SEND_MSG_COMPLETED');
  it.todo('UPDATE_SYSTEM_CARD_CHAT_DATA');
  it.todo('UPDATE_WRITING_STATUS');
  it.todo('UPDATE_USER_CHAT_EMOTION_CATALOG');
  it.todo('ADD_USER_CHAT_EMOTION_CATALOG');
  it.todo('SET_CONVERSES_MSGLOG_NOMORE');
});
