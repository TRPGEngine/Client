import type { GroupChannel, GroupInfo } from '@redux/types/group';

/**
 * 构建测试用的redux数据
 */
export function buildTestGroupInfo(info?: Partial<GroupInfo>): GroupInfo {
  return {
    id: 0,
    uuid: 'test-group-uuid',
    type: 'group',
    name: 'test group',
    sub_name: 'test sub name',
    desc: 'any',
    avatar: '',
    max_member: 50,
    allow_search: true,
    creator_uuid: '',
    owner_uuid: '',

    ...info,
  };
}

/**
 * 构建测试用的redux数据
 */
export function buildTestGroupChannelInfo(
  info?: Partial<GroupChannel>
): GroupChannel {
  return {
    uuid: 'test group channel',
    name: 'test group channel name',
    desc: '',
    visible: 'all',
    members: [],

    ...info,
  };
}
