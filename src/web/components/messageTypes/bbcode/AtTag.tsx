import React from 'react';
import type { TagProps } from '@shared/components/bbcode/type';
import { TMemo } from '@shared/components/TMemo';
import styled from 'styled-components';
import { useUserName } from '@redux/hooks/user';
import { t } from '@shared/i18n';

const AutoNameAtTag: React.FC<{
  userUUID: string;
}> = TMemo((props) => {
  const userName = useUserName(props.userUUID);
  return <Root>@{userName === '' ? t('加载中...') : userName}</Root>;
});
AutoNameAtTag.displayName = 'AutoNameAtTag';

const Root = styled.span`
  margin: 0 4px;
  color: ${(props) => props.theme.color['textLink']};
  user-select: none;
`;
export const AtTag: React.FC<TagProps> = TMemo((props) => {
  const { node } = props;
  const attrs = node.attrs;
  const text = node.content.join('');
  const uuid = attrs.uuid;

  if (text.length === 0) {
    return <AutoNameAtTag userUUID={uuid} />;
  }

  return <Root>@{text}</Root>;
});
AtTag.displayName = 'AtTag';
