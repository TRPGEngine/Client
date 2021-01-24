import React, { useMemo } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { CommonPanelProps } from './type';
import { getPanel } from './reg';
import { useEffect } from 'react';
import { trackEvent } from '@web/utils/analytics-helper';

/**
 * 通用团面板渲染组件
 */
export const GroupPanelView: React.FC<CommonPanelProps> = TMemo((props) => {
  const { panel } = props;
  const panelType = panel.type;

  const Component = useMemo(() => getPanel(panelType), [panelType]);

  useEffect(() => {
    trackEvent('group:viewPanel', {
      uuid: panel.uuid,
      name: panel.name,
      type: panel.type,
    });
  }, [panel]);

  if (!Component) {
    console.error('无法渲染未知的面板:', panelType);
    return null;
  }

  return <Component {...props} />;
});
GroupPanelView.displayName = 'GroupPanelView';
