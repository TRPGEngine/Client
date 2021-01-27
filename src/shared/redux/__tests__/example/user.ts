import type { UserInfo } from '@redux/types/user';

// 测试用户数据
export const testUserInfo: UserInfo = {
  id: 0,
  uuid: 'test-uuid',
  username: 'test-user',
  nickname: 'test-nick',
  name: 'test-name',
  avatar: 'test-avatar',
  last_login: '2020-07-03 16:07:52',
  last_ip: '0.0.0.0',
  token: '',
  app_token: '',
  sex: '男' as const,
  sign: '',
  alignment: null as any,
  qq_number: '',
};
