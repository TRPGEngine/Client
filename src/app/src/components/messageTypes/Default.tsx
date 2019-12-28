import React from 'react';
import { View, Clipboard } from 'react-native';
import _get from 'lodash/get';
import Base from './Base';
import { Modal } from '@ant-design/react-native';
import styled from 'styled-components/native';
import BBCode from '@src/shared/components/bbcode';
import { connect } from 'react-redux';
import { TRPGDispatchProp } from '@redux/types/__all__';
import { MessageProps } from '@shared/components/MessageHandler';
import { revokeMsg } from '@redux/actions/chat';

const MsgContainer = styled.TouchableHighlight.attrs({
  underlayColor: '#eee',
})<{
  isImage: boolean;
}>`
  padding: ${(props) => (props.isImage ? 0 : '6px 8px')};
`;

interface Props extends TRPGDispatchProp, MessageProps {}
class Default extends Base<Props> {
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
    const operations = [
      {
        text: '复制到剪切板',
        onPress: () => {
          // 复制文本到剪切板
          Clipboard.setString(this.message);
        },
      },
    ];

    if (this.props.me) {
      operations.push({
        text: '撤回消息',
        onPress: () => {
          // 撤回消息
          this.props.dispatch(revokeMsg(this.props.info.uuid));
        },
      });
    }

    Modal.operation(operations);
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

export default connect()(Default as any);
