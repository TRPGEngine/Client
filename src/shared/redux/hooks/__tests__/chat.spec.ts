import {
  buildBlankTestState,
  buildTestReduxProvider,
} from '@redux/__tests__/utils';
import { renderHook } from '@testing-library/react-hooks';
import { useUnreadGroupMap } from '../chat';
import {
  buildTestGroupChannelInfo,
  buildTestGroupInfo,
} from '@redux/__tests__/example/group';
import { buildTestChatConverse } from '@redux/__tests__/example/chat';

describe('redux hooks chat', () => {
  describe('useGroupUnread', () => {
    const { Provider: TestUseGroupUnreadProvider } = buildTestReduxProvider({
      overwriteState: {
        chat: {
          ...buildBlankTestState().chat,
          converses: {
            group1: buildTestChatConverse({
              uuid: 'group1',
              unread: false,
            }),
            group2: buildTestChatConverse({
              uuid: 'group2',
              unread: true,
            }),
            group3: buildTestChatConverse({
              uuid: 'group3',
              unread: false,
            }),
            group4: buildTestChatConverse({
              uuid: 'group4',
              unread: false,
            }),
            channel1: buildTestChatConverse({
              uuid: 'channel1',
              unread: true,
            }),
            channel2: buildTestChatConverse({
              uuid: 'channel2',
              unread: false,
            }),
            channel3: buildTestChatConverse({
              uuid: 'channel3',
              unread: false,
            }),
            channel4: buildTestChatConverse({
              uuid: 'channel4',
              unread: false,
            }),
          },
        },
        group: {
          ...buildBlankTestState().group,
          groups: [
            buildTestGroupInfo({
              uuid: 'group1',
            }),
            buildTestGroupInfo({
              uuid: 'group2',
            }),
            buildTestGroupInfo({
              uuid: 'group3',
              channels: [
                buildTestGroupChannelInfo({
                  uuid: 'channel1',
                }),
                buildTestGroupChannelInfo({
                  uuid: 'channel2',
                }),
              ],
            }),
            buildTestGroupInfo({
              uuid: 'group4',
              channels: [
                buildTestGroupChannelInfo({
                  uuid: 'channel3',
                }),
                buildTestGroupChannelInfo({
                  uuid: 'channel4',
                }),
              ],
            }),
          ],
        },
      },
    });

    test('should be ok', () => {
      const { result } = renderHook(
        () => useUnreadGroupMap(['group1', 'group2', 'group3', 'group4']),
        {
          wrapper: TestUseGroupUnreadProvider,
        }
      );

      const res = result.current;
      expect(res['group1']).toBe(false); // 无频道 大厅无未读
      expect(res['group2']).toBe(true); // 无频道 大厅未读
      expect(res['group3']).toBe(true); // 有频道 频道有未读
      expect(res['group4']).toBe(false); // 有频道 频道均无未读
    });
  });
});
