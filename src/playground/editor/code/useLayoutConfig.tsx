import React, { useState, useCallback, useMemo } from 'react';
import type { LayoutType } from '@shared/components/layout/XMLBuilder';
import LZString from 'lz-string';
import { useCounter } from 'react-use';
import copy from 'copy-to-clipboard';
import { message, Checkbox, Tooltip, Button } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import type { CheckboxChangeEvent } from 'antd/lib/checkbox';

/**
 * 布局设置
 */
export function useLayoutConfig(code: string) {
  const [layoutType, setLayoutType] = useState<LayoutType>('edit'); // 渲染类型
  const [isMobile, setIsMobile] = useState(false); // 是否为移动模式
  const handleChangeLayoutType = useCallback((e: CheckboxChangeEvent) => {
    setLayoutType(e.target.checked ? 'edit' : 'detail');
  }, []);
  const handleChangeIsMobile = useCallback((e: CheckboxChangeEvent) => {
    setIsMobile(e.target.checked ? true : false);
  }, []);

  const handleShareCode = useCallback(() => {
    const codehash = LZString.compressToEncodedURIComponent(code);
    const hash = `code/${codehash}`;
    const { origin, pathname } = window.location;

    copy(`${origin}${pathname}#${hash}`) &&
      message.success('分享链接已复制到剪切板');
  }, [code]);
  const [renderKey, { inc: incRenderKey }] = useCounter(0);
  const handleForceUpdate = useCallback(() => {
    incRenderKey();
  }, [incRenderKey]);

  const LayoutConfigEl = useMemo(() => {
    return (
      <div
        style={{ display: 'flex', flex: 1, justifyContent: 'space-between' }}
      >
        <div>
          <Checkbox
            checked={layoutType === 'edit'}
            onChange={handleChangeLayoutType}
          >
            编辑模式
          </Checkbox>
          <Checkbox checked={isMobile} onChange={handleChangeIsMobile}>
            移动页面
          </Checkbox>
        </div>
        <div style={{ display: 'flex' }}>
          <Tooltip title="强制刷新布局">
            <Button
              type="primary"
              onClick={handleForceUpdate}
              icon={<SyncOutlined />}
              style={{ marginRight: 4 }}
            />
          </Tooltip>
          <Tooltip title="分享给用户">
            <Button type="primary" onClick={handleShareCode}>
              分享给用户
            </Button>
          </Tooltip>
        </div>
      </div>
    );
  }, [
    layoutType,
    isMobile,
    handleChangeIsMobile,
    handleForceUpdate,
    handleShareCode,
  ]);

  return {
    layoutType,
    isMobile,
    renderKey,
    incRenderKey,
    LayoutConfigEl,
  };
}
