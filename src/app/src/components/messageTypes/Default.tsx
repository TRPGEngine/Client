import React from 'react';
import { View, Clipboard } from 'react-native';
import _get from 'lodash/get';
import Base from './Base';
import { Modal } from '@ant-design/react-native';
import styled from 'styled-components/native';
import BBCode from '@src/shared/components/bbcode';

const MsgContainer = styled.TouchableHighlight.attrs({
  underlayColor: '#eee',
})<{
  isImage: boolean;
}>`
  padding: ${(props) => (props.isImage ? 0 : '6px 8px')};
`;

class Default extends Base {
  get isMsgPadding() {
    return false;
  }

  /**
   * 消息文本
   */
  get message() {
    return _get(this.props, 'info.message', '');
  }

  /**
   * 是否为纯图片
   */
  get isImage() {
    const message = this.message;
    const isImage = message.startsWith('[img]') && message.endsWith('[/img]');
    return isImage;
  }

  handleLongPress = () => {
    Modal.operation([
      {
        text: '复制到剪切板',
        onPress: () => {
          // 复制文本到剪切板
          Clipboard.setString(this.message);
        },
      },
    ]);
  };

  getContent() {
    return (
      <MsgContainer isImage={this.isImage} onLongPress={this.handleLongPress}>
        <View>
          <BBCode plainText={this.message} />
        </View>
      </MsgContainer>
    );
  }
}

export default Default;
