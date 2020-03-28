import React from 'react';
import { TextProps } from 'react-native';
import styled from 'styled-components/native';

interface Props extends TextProps {
  icon: string;
}

const IconfontText = styled.Text`
  font-family: iconfont;
`;

class TIcon extends React.Component<Props> {
  static defaultProps = {
    icon: '',
  };

  render() {
    return <IconfontText {...this.props}>{this.props.icon}</IconfontText>;
  }
}

export default TIcon;
