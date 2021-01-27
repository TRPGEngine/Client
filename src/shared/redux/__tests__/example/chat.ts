import type { ChatStateConverse } from '@redux/types/chat';

/**
 * 构建测试用的redux数据
 */
export function buildTestChatConverse(
  info?: Partial<ChatStateConverse>
): ChatStateConverse {
  return {
    uuid: 'test-chat-converse-uuid',
    type: 'group',
    name: 'test converse',
    lastMsg: '',
    lastTime: new Date().valueOf(),
    msgList: [],

    ...info,
  };
}
