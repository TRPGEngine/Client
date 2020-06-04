import React, { useMemo } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { Tag } from 'antd';
import { getTextColorHex } from '@shared/utils/string-helper';

interface ColorTagProps {
  text: string;
}
export const ColorTag: React.FC<ColorTagProps> = TMemo((props) => {
  const color = useMemo(() => getTextColorHex(props.text), [props.text]);

  return <Tag color={color}>{props.text}</Tag>;
});
ColorTag.displayName = 'ColorTag';
