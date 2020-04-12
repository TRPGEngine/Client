export type LocalMsgType = 'loading';

export type MsgType =
  | 'normal'
  | 'system'
  | 'ooc'
  | 'speak'
  | 'action'
  | 'cmd'
  | 'card'
  | 'tip'
  | 'file'
  | LocalMsgType;

export interface MsgPayload {
  type: MsgType;
  message: string;
  uuid?: string;
  sender_uuid?: string;
  to_uuid?: string;
  converse_uuid?: string;
  is_public?: boolean;
  is_group?: boolean;
  revoke?: boolean;
  date?: string;
  data?: {
    [key: string]: any;
  };
}

export type MsgListType = MsgPayload[];

export interface ConverseInfo {
  uuid: string;
  type: 'user' | 'group' | 'system';
  name?: string;
}

type WritingListType = {
  user: string[];
  group: {
    [name: string]: string[];
  };
};

export type ChatStateConverseMsgList = MsgPayload[];

export type ChatStateConverse = {
  uuid: string;
  type: string;
  name: string;
  icon?: string;
  lastMsg: string;
  lastTime: number;
  msgList: ChatStateConverseMsgList;

  // 客户端信息
  unread?: boolean;
  nomore?: boolean;
};

export type ChatState = {
  selectedConverseUUID: string;
  conversesDesc: string;
  converses: { [name: string]: ChatStateConverse };
  writingList: WritingListType;
  emotions: { [name in 'catalogs' | 'favorites']: any[] };
};
