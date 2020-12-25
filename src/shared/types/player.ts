export interface PlayerTokenInfo {
  uuid: string;
  name: string;
  avatar: string;
}

/**
 * @deprecated 应该使用Client\src\shared\model\player.ts
 */
export interface PlayerUser {
  id: number;
  name?: string;
  uuid: string;
  username: string;
  nickname: string;
  avatar: string;
  last_login: string;
  last_ip: string;
  sex: string;
  sign: string;
  alignment: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}
