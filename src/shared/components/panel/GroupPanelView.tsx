import React, { useMemo } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { CommonPanelProps } from './type';
import { getPanel } from './reg';

/**
 * 通用团面本渲染组件
 */
export const GroupPanelView: React.FC<CommonPanelProps> = TMemo((props) => {
  const { panel } = props;
  const panelType = panel.type;

  const Component = useMemo(() => getPanel(panelType), [panelType]);

  if (!Component) {
    console.error('无法渲染未知的面板:', panelType);
    return null;
  }

  return <Component {...props} />;
});
GroupPanelView.displayName = 'GroupPanelView';
