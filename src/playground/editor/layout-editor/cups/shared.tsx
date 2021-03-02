import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { Space, Typography } from 'antd';
import _isString from 'lodash/isString';
import { TipIcon } from '@web/components/TipIcon';

export const CupEditorWrapper: React.FC<{
  title: string;
  desc?: string;
}> = TMemo((props) => {
  const { title, desc } = props;

  return (
    <div>
      <Space>
        <Typography.Text>{title}</Typography.Text>

        {_isString(desc) && <TipIcon desc={desc} />}
      </Space>

      <div>{props.children}</div>
    </div>
  );
});
CupEditorWrapper.displayName = 'CupEditorWrapper';
