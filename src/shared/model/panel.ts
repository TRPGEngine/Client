import type { GroupPanel } from '@shared/types/panel';
import { request } from '@shared/utils/request';

/**
 * 更新面板排序
 * @param panels 面板
 */
export async function updatePanelOrder(
  groupUUID: string,
  panels: GroupPanel[]
) {
  const panelOrderList = panels.map((panel, i) => {
    return {
      uuid: panel.uuid,
      order: i,
    };
  });

  await request.post(`/group/${groupUUID}/panel/updateOrder`, {
    panelOrderList,
  });
}

/**
 * 移除面板
 */
export async function removePanel(groupUUID: string, panelUUID: string) {
  await request.post(`/group/${groupUUID}/panel/${panelUUID}/remove`);
}
