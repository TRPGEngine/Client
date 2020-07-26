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

// 别人发给我的
export interface FriendRequest {
  id: number;
  uuid: string;
  from_uuid: string;
  to_uuid: string;
  is_agree: boolean;
  is_refuse: boolean;
  createdAt: string;
  updatedAt: string;
}

export type UserState = {
  isTryLogin: boolean;
  isLogin: boolean;
  info: Partial<UserInfo>;
  webToken: string; // 用于portal登录的token
  friendList: string[];
  friendInvite: string[]; // 好友邀请(自己发给别人的)
  friendRequests: FriendRequest[]; // 好友请求(别人发给自己的)
  isFindingUser: boolean;
  findingResult: any[];
};
