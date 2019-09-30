import React from 'react';
import { Text, TouchableOpacity, Linking } from 'react-native';
import { connect, DispatchProp } from 'react-redux';
import { openWebview } from '../redux/actions/nav';

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
      <Text>{props.children}</Text>
    </TouchableOpacity>
  );
};

export default React.memo(connect()(Link));
