import { Record, List } from 'immutable';

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

export type UserStateInfo = Record<UserInfo>;

export type UserState = Record<{
  isTryLogin: boolean;
  isLogin: boolean;
  info: UserStateInfo;
  friendList: List<string>;
  friendInvite: List<any>;
  friendRequests: List<any>;
  isFindingUser: boolean;
  findingResult: List<any>;
}>;
