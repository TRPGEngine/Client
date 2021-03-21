import type { GroupPanelType } from '@shared/types/panel';
import { Iconfont } from '@web/components/Iconfont';
import React from 'react';
import styled from 'styled-components';

const DefaultPanelIconContainer = styled.div`
  padding-left: 2px;
  padding-right: 2px;
`;

/**
 * 获取团面板Icon
 */
export function getGroupPanelIcon(panelType: GroupPanelType) {
  if (panelType === 'voicechannel') {
    return <Iconfont>&#xe664;</Iconfont>;
  }

  return <DefaultPanelIconContainer>#</DefaultPanelIconContainer>;
}
