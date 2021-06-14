import { buildRegList } from '@shared/manager/buildRegList';
import type { SidebarViewMenuItem } from '@web/components/SidebarView';

export const [extraSettingViewMenu, regSettingViewMenu] =
  buildRegList<SidebarViewMenuItem>();
