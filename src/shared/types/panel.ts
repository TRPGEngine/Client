/**
 * 团面板可见性
 */
export type GroupPanelVisible = 'all' | 'manager' | 'assign';

export type GroupPanelType =
  | 'channel'
  | 'note'
  | 'voicechannel'
  | 'calendar'
  | 'website';

export interface GroupPanel {
  uuid: string;
  name: string;
  type: GroupPanelType;
  color: string;
  order: number;
  target_uuid: string;
  visible: GroupPanelVisible; // 可见性
  members: string[]; // 当visible为assign时有效
}
