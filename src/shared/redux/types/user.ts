export type UserAlignment =
  | 'LG'
  | 'NG'
  | 'CG'
  | 'LN'
  | 'TN'
  | 'CN'
  | 'LE'
  | 'NE'
  | 'CE';

export type UserGender = '男' | '女' | '其他' | '保密';

export interface UserInfo {
  id: number;
  uuid: string;
  username: string;
  nickname: string;
  name: string;
  avatar: string;
  last_login: string;
  last_ip: string;
  token?: string;
  app_token?: string;
  sex: UserGender;
  sign: string;
  alignment: UserAlignment;
}

export type UserState = {
  isTryLogin: boolean;
  isLogin: boolean;
  info: Partial<UserInfo>;
  webToken: string; // 用于portal登录的token
  friendList: string[];
  friendInvite: any[];
  friendRequests: any[];
  isFindingUser: boolean;
  findingResult: any[];
};
