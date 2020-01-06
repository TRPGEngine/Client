import React from 'react';
import { TagProps } from '@shared/components/bbcode/type';

const PlainText: React.FC<TagProps> = React.memo((props) => (
  <pre>{props.children}</pre>
));
PlainText.displayName = 'PlainText';

export default PlainText;
