import React from 'react';
import { Text } from 'react-native';

const PlainText = React.memo((props) => <Text>{props.children}</Text>);

export default PlainText;
