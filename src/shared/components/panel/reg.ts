import { CommonPanelProps } from './type';

type GroupPanelComponent = React.ReactType<CommonPanelProps>;

const panel = new Map<string, GroupPanelComponent>();

/**
 * 注册面板
 */
export function regPanel(type: string, component: GroupPanelComponent): void {
  panel.set(type, component);
}

/**
 * 获取面板
 */
export function getPanel(type: string): GroupPanelComponent | undefined {
  return panel.get(type);
}

/**
 * 检测面板是否存在
 */
export function hasPanel(type: string): boolean {
  return panel.has(type);
}
