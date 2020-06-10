import React from 'react';
import { connect } from 'react-redux';
import { clearSelectedConverse } from '@shared/redux/actions/chat';
import _get from 'lodash/get';
import _isNil from 'lodash/isNil';
import _isArray from 'lodash/isArray';
import _throttle from 'lodash/throttle';
import _orderBy from 'lodash/orderBy';
import _last from 'lodash/last';
import { ChatParams } from '../../types/params';
import { UserMsgType } from './InputView';
import { TRPGState, TRPGDispatchProp } from '@src/shared/redux/types/__all__';
import { clearSelectGroup } from '@src/shared/redux/actions/group';
import { MsgListType } from '@redux/types/chat';
import { ChatScreenMain } from './Main';
import { ChatScreenProvider } from './Provider';
import { TRPGStackScreenProps } from '@app/router';
import TIcon from '@app/components/TComponent/TIcon';
import { View } from 'react-native';

interface Props extends TRPGDispatchProp, TRPGStackScreenProps<'Chat'> {
  msgList: MsgListType;
  selfInfo: any;
  selfUUID: string;
  nomore: boolean;
  selectedConverseUUID: string;
  isWriting: boolean;
}
interface State {
  inputMsg: string;
  msgType: UserMsgType;
  showExtraPanel: boolean;
  showEmoticonPanel: boolean;
  isKeyboardShow: boolean;
  showQuickDiceModal: boolean;
}
class ChatScreen extends React.Component<Props, State> {
  get converseType() {
    return this.props.route.params?.type ?? 'user';
  }

  componentDidMount() {
    const converseType = this.converseType;

    const func = () => {
      if (converseType === 'user') {
        this.props.navigation.navigate('Profile', {
          uuid: this.props.route.params?.uuid,
          type: converseType,
          name: this.props.route.params?.name,
        });
      } else if (converseType === 'group') {
        this.props.navigation.navigate('GroupData', {
          uuid: this.props.route.params?.uuid,
          name: this.props.route.params?.name,
          type: converseType,
        });
      }
    };

    this.props.navigation.setOptions({
      headerRight: () =>
        ['user', 'group'].includes(converseType) ? (
          <View style={{ marginRight: 10 }}>
            <TIcon icon="&#xe607;" style={{ fontSize: 26 }} onPress={func} />
          </View>
        ) : null,
    });
  }

  componentWillUnmount() {
    if (this.converseType === 'group') {
      this.props.dispatch(clearSelectGroup());
    } else {
      this.props.dispatch(clearSelectedConverse());
    }
  }

  componentDidUpdate(prevProps: Readonly<Props>) {
    const { isWriting } = this.props;

    if (prevProps.isWriting !== isWriting) {
      // 如果isWriting 更新, 则设置参数
      this.props.navigation.setParams({ isWriting });
    }
  }

  render() {
    return (
      <ChatScreenProvider type={this.converseType}>
        <ChatScreenMain
          converseUUID={this.props.selectedConverseUUID}
          converseType={this.converseType}
        />
      </ChatScreenProvider>
    );
  }
}

export default connect((state: TRPGState, ownProps: Props) => {
  const selectedConverseUUID = ownProps.route.params?.uuid ?? '';
  const converseType = ownProps.route.params?.type ?? 'user';
  let isWriting = false;
  if (converseType === 'user') {
    // TODO: 暂时先只实现用户会话的输入中提示
    isWriting = (state.chat.writingList.user ?? []).includes(
      selectedConverseUUID
    );
  }

  return {
    selectedConverseUUID,
    isWriting,
  };
})(ChatScreen);
