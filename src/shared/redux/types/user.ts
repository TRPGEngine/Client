import { Record, List } from 'immutable';

export type UserState = Record<{
  isTryLogin: boolean;
  isLogin: boolean;
  info: any;
  friendList: List<any>;
  friendInvite: List<any>;
  friendRequests: List<any>;
  isFindingUser: boolean;
  findingResult: List<any>;
}>;
