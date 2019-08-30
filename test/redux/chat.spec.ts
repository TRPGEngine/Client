import chatReducer from '@redux/reducers/chat';
import { isImmutable, isMap, isList } from 'immutable';

describe('chat reducer', () => {
  it('init state', () => {
    const state = chatReducer(undefined, { type: 'any' });
    expect(isImmutable(state)).toBe(true);

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

  it.todo('ADD_MSG');
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
