import React, { useCallback } from 'react';
import styled from 'styled-components/native';
import { TMemo } from '@shared/components/TMemo';
import { useTRPGNavigation } from '@app/hooks/useTRPGNavigation';

const LinkText = styled.Text`
  color: #3498db;
  text-decoration: underline;
`;

interface Props {
  url: string;
  children: string;
}
const Link: React.FC<Props> = TMemo((props) => {
  const { openWebview } = useTRPGNavigation();
  const onPress = useCallback(() => {
    openWebview(props.url);
  }, [openWebview, props.url]);

  return <LinkText onPress={onPress}>{props.children}</LinkText>;
});
Link.displayName = 'Link';

export default Link;
