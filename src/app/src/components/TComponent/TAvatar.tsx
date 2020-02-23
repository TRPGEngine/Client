import React from 'react';
import { ImageSourcePropType } from 'react-native';
import _isString from 'lodash/isString';
import TImage from './TImage';
import styled from 'styled-components/native';
import { getAvatarColorHex } from '@shared/utils/string-helper';

const TImageAvatar = styled(TImage)<{
  height: number;
  width: number;
}>`
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  border-radius: ${(props) => props.width / 2}px;
  overflow: hidden;
`;

const NormalAvatar = styled.Image<{
  height: number;
  width: number;
}>`
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  border-radius: ${(props) => props.width / 2}px;
`;

const TextAvatar = styled.View<{
  height: number;
  width: number;
  color: string;
}>`
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  border-radius: ${(props) => props.width / 2}px;
  background-color: ${(props) => props.color};
  align-items: center;
  justify-content: center;
`;

const CapitalText = styled.Text`
  text-align: center;
  text-align-vertical: center;
  color: white;
`;

interface Props {
  uri: string | ImageSourcePropType;
  name: string;
  style: any;
  capitalSize: number;
  height: number;
  width: number;
}
class TAvatar extends React.PureComponent<Props> {
  static defaultProps = {
    uri: '',
    name: '',
    style: [],
    capitalSize: 20,
    height: 100,
    width: 100,
  };

  static errorImageUri: string[] = []; // 记录错误列表

  state = {
    loadError: false,
  };

  onImageLoadError = () => {
    const { uri } = this.props;

    if (_isString(uri)) {
      TAvatar.errorImageUri.push(uri);
    }
    this.setState({ loadError: true });
  };

  render() {
    let { uri, name, style, capitalSize, height, width } = this.props;

    if (!(style instanceof Array)) {
      style = [style];
    }

    let capital = name[0];
    if (capital) {
      capital = capital.toUpperCase();
    }
    const color = getAvatarColorHex(name);

    if (
      uri &&
      !this.state.loadError &&
      !TAvatar.errorImageUri.includes(String(uri))
    ) {
      if (typeof uri === 'string') {
        // 如果是网络地址。则使用TImage作为缓存
        return (
          <TImageAvatar
            style={style}
            width={width}
            height={height}
            url={uri}
            onError={this.onImageLoadError}
            hideLoading={true}
          />
        );
      } else {
        return (
          <NormalAvatar
            style={style}
            width={width}
            height={height}
            source={uri}
            onError={this.onImageLoadError}
          />
        );
      }
    } else {
      return (
        <TextAvatar style={style} color={color} height={height} width={width}>
          <CapitalText style={{ fontSize: capitalSize }}>{capital}</CapitalText>
        </TextAvatar>
      );
    }
  }
}

export default TAvatar;
