import chatReducer from '@src/shared/redux/reducers/chat';
import configureStore from '@src/shared/redux/configureStore';
import * as chatActions from '@src/shared/redux/actions/chat';
import { MsgPayload } from '@src/shared/redux/types/chat';
import _isEmpty from 'lodash/isEmpty';
import _isObject from 'lodash/isObject';
import _isArray from 'lodash/isArray';

/**
 * 获取初始状态
 */
const getInitState = () => chatReducer(undefined, { type: 'any' });

describe('chat reducer', () => {
  // tslint:disable-next-line: no-empty
  test('TODO', () => {});
});

describe('chat reducer', () => {
  it('init state', () => {
    const state = getInitState();

    // 检查默认参数
    expect(state.selectedConverseUUID).toBe('');
    expect(state.conversesDesc).toBe('');
    expect(_isObject(state.converses)).toBe(true);
    expect(_isArray(state.writingList.user)).toBe(true);
    expect(_isObject(state.writingList.group)).toBe(true);
    expect(_isObject(state.emotions)).toBe(true);
    expect(_isArray(state.emotions.catalogs)).toBe(true);
    expect(_isArray(state.emotions.favorites)).toBe(true);
  });

  it('ADD_CONVERSES', () => {
    const state = chatReducer(undefined, {
      type: 'ADD_CONVERSES',
      payload: {
        uuid: 'test',
        others: 'others',
      },
    });

    expect(_isObject(state.converses)).toBe(true);
    expect(_isObject(state.converses.test)).toBe(true);
    expect(_isArray(state.converses.test?.msgList)).toBe(true);
    expect(typeof state.converses.test?.lastMsg).toBe('string');
    expect(typeof state.converses.test?.lastTime).toBe('string');
    expect(state.converses.test?.uuid).toBe('test');
    expect(state.converses.test?.others).toBe('others');
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
      {
        ...getInitState(),
        converses: {
          test: {
            uuid: 'test',
            lastMsg: '',
            lastTime: '' as any,
            msgList: [],
          } as any,
        },
      },
      {
        type: 'ADD_MSG',
        converseUUID: 'test',
        payload: {
          message: 'any',
          date,
        },
      }
    );

    expect(_isObject(state2.converses)).toBe(true);
    expect(_isObject(state2.converses.test)).toBe(true);
    expect(_isArray(state2.converses.test?.msgList)).toBe(true);
    expect(state2.converses.test).toMatchObject({
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
      {
        ...getInitState(),
        converses: {
          test: {
            uuid: 'test',
            lastMsg: '',
            lastTime: '' as any,
            msgList: [
              {
                uuid: 'local1',
              },
              {
                uuid: 'local2',
              },
            ],
          } as any,
        },
      },
      {
        type: 'REMOVE_MSG',
        converseUUID: 'test',
        localUUID: 'local1',
      }
    );

    expect(_isArray(state.converses.test?.msgList)).toBe(true);
    expect(state.converses.test?.msgList).toMatchObject([{ uuid: 'local2' }]);
  });

  it('GET_CONVERSES_REQUEST', () => {
    const state = chatReducer(undefined, {
      type: 'GET_CONVERSES_REQUEST',
    });

    expect(state.conversesDesc).toBe('正在获取会话列表...');
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

    expect(state.converses).toMatchObject({
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

    expect(state.conversesDesc).toBe('获取会话列表失败, 请重试');
  });

  it('REMOVE_CONVERSES_SUCCESS and REMOVE_USER_CONVERSE', () => {
    const state = chatReducer(
      {
        ...getInitState(),
        converses: {
          test: {
            uuid: 'test',
          } as any,
        },
      },
      {
        type: 'REMOVE_CONVERSES_SUCCESS',
        converseUUID: 'test',
      }
    );

    expect(state.converses.test).toBeUndefined();
  });

  it.todo('SEND_MSG_COMPLETED');
  it.todo('UPDATE_SYSTEM_CARD_CHAT_DATA');
  it.todo('UPDATE_WRITING_STATUS');
  it.todo('UPDATE_USER_CHAT_EMOTION_CATALOG');
  it.todo('ADD_USER_CHAT_EMOTION_CATALOG');

  it('SET_CONVERSES_MSGLOG_NOMORE', () => {
    const state = chatReducer(
      {
        ...getInitState(),
        converses: {
          test: {
            nomore: false,
          } as any,
        },
      },
      {
        type: 'SET_CONVERSES_MSGLOG_NOMORE',
        converseUUID: 'test',
        nomore: true,
      }
    );

    expect(state.converses.test?.nomore).toBe(true);
  });
});

describe('chat action', () => {
  it('chat.addFakeMsg', () => {
    const fakeMsgPayload: MsgPayload = {
      sender_uuid: 'test_sender',
      converse_uuid: 'test_converse',
      message: 'test_message',
      type: 'normal',
    } as any;
    const store = configureStore();
    store.dispatch(chatActions.addFakeMsg(fakeMsgPayload));

    const state = store.getState();

    expect(_isArray(state.chat.converses.test_converse?.msgList)).toBe(true);
    expect(_isObject(state.chat.converses.test_converse?.msgList[0])).toBe(
      true
    );
    expect(state.chat.converses.test_converse?.msgList[0]?.uuid).toContain(
      'local'
    );
  });

  it('chat.addLoadingMsg', () => {
    const store = configureStore();
    const mockCb = jest.fn();
    store.dispatch(
      chatActions.addLoadingMsg(
        'test_converse',
        mockCb
        // ({ updateProgress, removeLoading }) => {}
      )
    );

    const state = store.getState();
    const loadingMsg = state.chat.converses.test_converse?.msgList[0];
    expect(_isObject(loadingMsg)).toBe(true);
    expect(loadingMsg.uuid).toContain('local');
    expect(loadingMsg).toMatchObject({
      message: '[处理中...]',
      type: 'loading',
      converse_uuid: 'test_converse',
      data: {
        progress: 0,
      },
    });
    expect(mockCb).toBeCalledTimes(1);
  });
});
