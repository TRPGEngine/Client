import React, { useCallback, useState, useMemo } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { Popover } from 'antd';
import { PopoverProps } from 'antd/lib/popover';

export const TPopoverContext = React.createContext({ closePopover: () => {} });

/**
 * 重新封装一层Popover
 * 管理Popover的显示与隐藏
 * 可以由Context来让子节点关闭popover
 */
export const TPopover: React.FC<PopoverProps> = TMemo((props) => {
  const [visible, setVisible] = useState(false);

  const handleVisibleChange = useCallback((visible) => {
    setVisible(visible);
  }, []);

  const closePopover = useCallback(() => {
    setVisible(false);
  }, []);

  const handler = useMemo(() => ({ closePopover }), [closePopover]);

  return (
    <TPopoverContext.Provider value={handler}>
      <Popover
        {...props}
        visible={visible}
        onVisibleChange={handleVisibleChange}
      />
    </TPopoverContext.Provider>
  );
});
TPopover.displayName = 'TPopover';
