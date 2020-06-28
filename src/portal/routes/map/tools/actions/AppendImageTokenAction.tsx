import React, { useState, useCallback } from 'react';
import _isFunction from 'lodash/Function';
import { AppendTokenAction } from './AppendTokenAction';
import { Input } from 'antd';
import { TMemo } from '@shared/components/TMemo';

/**
 * 增加图片棋子操作
 */
export const AppendImageTokenAction: React.FC<{
  onConfirm?: (imageUrl: string, x: number, y: number) => void;
}> = TMemo((props) => {
  const [imageUrl, setImageUrl] = useState('');
  const handleConfirm = useCallback(
    (x, y) => {
      if (imageUrl === '') {
        return;
      }
      _isFunction(props.onConfirm) && props.onConfirm(imageUrl, x, y);
    },
    [props.onConfirm, imageUrl]
  );

  return (
    <AppendTokenAction
      content={
        <Input
          placeholder="网络图片地址"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
      }
      onConfirm={handleConfirm}
    />
  );
});
