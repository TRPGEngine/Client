import { buildRegList } from '@shared/manager/buildRegList';
import type { SidebarViewMenuItemType } from '@web/components/SidebarView';

export const [groupInfoMenuList, regGroupInfoMenu] =
  buildRegList<SidebarViewMenuItemType>();
