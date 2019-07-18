export type MsgType =
  | 'normal'
  | 'system'
  | 'ooc'
  | 'speak'
  | 'action'
  | 'cmd'
  | 'card'
  | 'tip'
  | 'file';

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
  data?: {};
}
