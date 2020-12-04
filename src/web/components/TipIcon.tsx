import React, { useCallback } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import _isString from 'lodash/isString';

interface TipIconProps {
  desc: string;
  link?: string;
}
export const TipIcon: React.FC<TipIconProps> = TMemo((props) => {
  const { desc, link } = props;

  const handleClick = useCallback(() => {
    if (_isString(link)) {
      window.open(link);
    }
  }, [link]);

  return (
    <Tooltip title={desc}>
      <QuestionCircleOutlined onClick={handleClick} />
    </Tooltip>
  );
});
TipIcon.displayName = 'TipIcon';
