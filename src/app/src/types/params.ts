export type ChatType = 'user' | 'group' | 'system';
export interface ChatParams {
  uuid: string;
  type: ChatType;
  name: string;
  isWriting?: boolean;
}

export type GroupDataParams = Pick<ChatParams, 'uuid' | 'type' | 'name'>;

export type GroupMemberParams = Pick<ChatParams, 'uuid'>;
