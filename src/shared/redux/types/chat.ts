export type LocalMsgType = 'loading';

export type ConverseType = 'user' | 'group' | 'system';

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
  uuid: string;
  sender_uuid: string;
  to_uuid?: string;
  converse_uuid?: string;
  is_public: boolean;
  is_group: boolean;
  revoke: boolean;
  date: string;
  data?: {
    [key: string]: any;
  };
}

// 渲染消息时所必须的参数
export type RenderMsgPayload = Pick<
  MsgPayload,
  'uuid' | 'sender_uuid' | 'message' | 'type' | 'date' | 'data' | 'revoke'
>;

// 发送消息时所必须的参数
export type SendMsgPayload = Pick<
  MsgPayload,
  'converse_uuid' | 'type' | 'message' | 'is_public' | 'is_group' | 'data'
>;

export type MsgListType = MsgPayload[];

export interface ConverseInfo {
  uuid: string;
  type: ConverseType;
  name?: string;
}

export interface WritingListGroupItem {
  uuid: string; // 此处的UUID指的是用户的UUID
  text: string;
}
type WritingListType = {
  user: string[];
  group: {
    [name: string]: WritingListGroupItem[];
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

  // 其他自定义信息
  [others: string]: any;
};

export type ChatState = {
  selectedConverseUUID: string;
  conversesDesc: string;
  converses: { [name: string]: ChatStateConverse };
  writingList: WritingListType;
  emotions: { [name in 'catalogs' | 'favorites']: any[] };
};
