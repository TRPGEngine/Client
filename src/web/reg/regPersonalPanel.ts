import { buildRegList } from '@shared/manager/buildRegList';

export const [personalPanelItemList, regPersonalPanelItem] =
  buildRegList<React.ReactElement>();
export const [personalPanelContentList, regPersonalPanelContent] =
  buildRegList<React.ReactElement>();
