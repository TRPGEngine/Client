import { MsgType } from '@redux/types/chat';

export interface ChatLogItem {
  uuid: string;
  sender_uuid: string;
  to_uuid: string;
  converse_uuid: string;
  message: string;
  type: MsgType;
  data: {};
  is_group: boolean;
  is_public: boolean;
  revoke: boolean;
}
