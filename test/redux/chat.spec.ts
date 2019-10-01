import chatReducer from '@src/shared/redux/reducers/chat';
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

  it('REMOVE_MSG', () => {
    const state = chatReducer(
      fromJS({
        converses: {
          test: {
            uuid: 'test',
            lastMsg: '',
            lastTime: '',
            msgList: [
              {
                uuid: 'local1',
              },
              {
                uuid: 'local2',
              },
            ],
          },
        },
      }),
      {
        type: 'REMOVE_MSG',
        converseUUID: 'test',
        localUUID: 'local1',
      }
    );

    expect(state.getIn(['converses', 'test', 'msgList'])).toBeImmutableList();
    expect(state.getIn(['converses', 'test', 'msgList']).toJS()).toMatchObject([
      { uuid: 'local2' },
    ]);
  });

  it('GET_CONVERSES_REQUEST', () => {
    const state = chatReducer(undefined, {
      type: 'GET_CONVERSES_REQUEST',
    });

    expect(state.get('conversesDesc')).toBe('正在获取会话列表...');
  });

  it('GET_CONVERSES_SUCCESS and GET_USER_CONVERSES_SUCCESS', () => {
    const state = chatReducer(undefined, {
      type: 'GET_CONVERSES_SUCCESS',
      payload: [
        {
          uuid: 'test1',
          others: 'others',
        },
        {
          uuid: 'test2',
          others: 'others',
        },
        {
          uuid: 'test3',
          others: 'others',
        },
      ],
    });

    expect(state.get('converses').toJS()).toMatchObject({
      test1: {
        uuid: 'test1',
        others: 'others',
        msgList: [],
        lastMsg: '',
        lastTime: '',
      },
      test2: {
        uuid: 'test2',
        others: 'others',
        msgList: [],
        lastMsg: '',
        lastTime: '',
      },
      test3: {
        uuid: 'test3',
        others: 'others',
        msgList: [],
        lastMsg: '',
        lastTime: '',
      },
    });
  });

  it.todo('UPDATE_CONVERSES_INFO_SUCCESS');
  it.todo('UPDATE_CONVERSES_MSGLIST_SUCCESS');
  it.todo('SWITCH_CONVERSES');
  it.todo('CREATE_CONVERSES_SUCCESS');

  it('CREATE_CONVERSES_FAILED', () => {
    const state = chatReducer(undefined, {
      type: 'CREATE_CONVERSES_FAILED',
    });

    expect(state.get('conversesDesc')).toBe('获取会话列表失败, 请重试');
  });

  it('REMOVE_CONVERSES_SUCCESS and REMOVE_USER_CONVERSE', () => {
    const state = chatReducer(
      fromJS({
        converses: {
          test: {
            uuid: 'test',
          },
        },
      }),
      {
        type: 'REMOVE_CONVERSES_SUCCESS',
        converseUUID: 'test',
      }
    );

    expect(state.getIn(['converses', 'test'])).toBeUndefined();
  });

  it.todo('SEND_MSG_COMPLETED');
  it.todo('UPDATE_SYSTEM_CARD_CHAT_DATA');
  it.todo('UPDATE_WRITING_STATUS');
  it.todo('UPDATE_USER_CHAT_EMOTION_CATALOG');
  it.todo('ADD_USER_CHAT_EMOTION_CATALOG');

  it('SET_CONVERSES_MSGLOG_NOMORE', () => {
    const state = chatReducer(
      fromJS({
        converses: {
          test: {
            nomore: false,
          },
        },
      }),
      {
        type: 'SET_CONVERSES_MSGLOG_NOMORE',
        converseUUID: 'test',
        nomore: true,
      }
    );

    expect(state.getIn(['converses', 'test', 'nomore'])).toBe(true);
  });
});
