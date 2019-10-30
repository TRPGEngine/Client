import { List, Map, Record } from 'immutable';

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
  date?: string;
  data?: {
    [key: string]: any;
  };
}

export interface ConverseInfo {
  uuid: string;
  type: 'user' | 'group' | 'system';
  name?: string;
}

type WritingListType =
  | Map<'user', List<string>>
  | Map<'group', Map<string, List<string>>>;

export type ChatState = Record<{
  selectedConverseUUID: string;
  conversesDesc: string;
  converses: Map<string, any>;
  writingList: WritingListType;
  emotions: Map<'catalogs' | 'favorites', List<any>>;
}>;
