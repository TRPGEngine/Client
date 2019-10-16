import React from 'react';
import { TouchableOpacity } from 'react-native';
import { connect, DispatchProp } from 'react-redux';
import { openWebview } from '../redux/actions/nav';
import styled from 'styled-components/native';

const LinkText = styled.Text`
  color: #3498db;
  text-decoration: underline;
`;

interface Props extends DispatchProp {
  url: string;
  children: string;
}
const Link = (props: Props) => {
  const onPress = () => {
    props.dispatch(openWebview(props.url));
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <LinkText>{props.children}</LinkText>
    </TouchableOpacity>
  );
};

export default React.memo(connect()(Link));
