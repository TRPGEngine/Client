export type ChatType = 'user' | 'group' | 'system';
export interface ChatParams {
  uuid: string;
  type: ChatType;
  name: string;
}
