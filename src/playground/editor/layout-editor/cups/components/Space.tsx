import React from 'react';
import { regCup, useCurrentTeaId } from '@saucerjs/core';
import { Space, Input } from 'antd';
import { SelectEditorField } from '../shared';

const CUP_NAME = 'Space';

regCup({
  name: CUP_NAME,
  displayName: '间隔容器',
  desc: '将子项进行一定间隔的容器',
  type: 'container',
  render({ nodeId, attrs, children }) {
    return (
      <Space size={attrs.size} direction={attrs.direction}>
        {children}
      </Space>
    );
  },
  editor() {
    return (
      <div>
        <SelectEditorField
          label="大小"
          field="size"
          options={[
            {
              value: 'small',
              label: '小',
            },
            {
              value: 'middle',
              label: '中',
            },
            {
              value: 'large',
              label: '大',
            },
          ]}
        />

        <SelectEditorField
          label="方向"
          field="direction"
          options={[
            {
              value: 'horizontal',
              label: '水平',
            },
            {
              value: 'vertical',
              label: '垂直',
            },
          ]}
        />
      </div>
    );
  },
});
function useTeaAttrsContext(): {
  currentTeaAttrs: any;
  setCurrentTeaAttrs: any;
} {
  throw new Error('Function not implemented.');
}
