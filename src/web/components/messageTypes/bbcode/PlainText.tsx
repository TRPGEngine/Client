import React from 'react';
import { TagProps } from '@shared/components/bbcode/type';
import { TMemo } from '@shared/components/TMemo';

const PlainText: React.FC<TagProps> = TMemo((props) => (
  <pre>{props.children}</pre>
));
PlainText.displayName = 'PlainText';

export default PlainText;
