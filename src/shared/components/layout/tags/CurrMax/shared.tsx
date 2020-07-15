import React from 'react';
import { Input } from 'antd';
import { TMemo } from '@shared/components/TMemo';

export const TagCurrMaxSplitInput: React.FC = TMemo(() => {
  return (
    <Input
      style={{
        width: 30,
        borderLeft: 0,
        borderRight: 0,
        pointerEvents: 'none',
        backgroundColor: 'white',
      }}
      placeholder="/"
      disabled={true}
    />
  );
});
TagCurrMaxSplitInput.displayName = 'TagCurrMaxSplitInput';

export function buildMaxPropsName(name: string) {
  return 'max-' + name;
}
