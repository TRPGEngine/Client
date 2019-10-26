import React from 'react';
import { View, Text, Image, ImageSourcePropType } from 'react-native';
import sb from 'react-native-style-block';
import config from '../../../../shared/project.config';
import str2int from 'str2int';
import _isString from 'lodash/isString';
import TImage from './TImage';
import styled from 'styled-components/native';

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

interface Props {
  uri: string | ImageSourcePropType;
  name: string;
  style: any;
  capitalSize: number;
  height: number;
  width: number;
}
class TAvatar extends React.Component<Props> {
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

  getColor(name) {
    if (!name) {
      return '#ffffff'; // 如果获取不到名字，则返回白色
    }

    const color = config.defaultImg.color;
    const id = str2int(name);
    return color[id % color.length];
  }

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
    let color = this.getColor(name);

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
        <View
          style={[
            ...style,
            { backgroundColor: color, height, width },
            sb.center(),
          ]}
        >
          <Text style={[...styles.capital, { fontSize: capitalSize }]}>
            {capital}
          </Text>
        </View>
      );
    }
  }
}

const styles = {
  capital: [
    {
      textAlign: 'center',
      textAlignVertical: 'center',
    },
    sb.color(),
  ],
};

export default TAvatar;
