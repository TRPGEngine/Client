import React from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { TIcon } from '@app/components/TComponent';
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

type Params = ChatParams & { headerRightFunc?: () => void };

interface Props extends TRPGDispatchProp, NavigationScreenProps<Params> {
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
  static navigationOptions = (props: Props) => {
    const navigation = props.navigation;
    const { state, getParam, setParams } = navigation;
    const { params } = state;
    const type = getParam('type');
    const isWriting = getParam('isWriting', false);
    return {
      headerTitle: isWriting ? '正在输入...' : `与 ${params.name} 的聊天`,
      headerRight: ['user', 'group'].includes(type) ? (
        <View style={{ marginRight: 10 }}>
          <TIcon
            icon="&#xe607;"
            style={{ fontSize: 26 } as any}
            onPress={() => params.headerRightFunc && params.headerRightFunc()}
          />
        </View>
      ) : null,
    };
  };

  get converseType() {
    return this.props.navigation.getParam('type', 'user');
  }

  componentDidMount() {
    const converseType = this.converseType;

    this.props.navigation.setParams({
      headerRightFunc: () => {
        if (converseType === 'user') {
          this.props.navigation.navigate(
            'Profile',
            this.props.navigation.state.params
          );
        } else if (converseType === 'group') {
          this.props.navigation.navigate(
            'GroupData',
            this.props.navigation.state.params
          );
        }
      },
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
      <ChatScreenMain
        converseUUID={this.props.selectedConverseUUID}
        converseType={this.converseType}
      />
    );
  }
}

export default connect((state: TRPGState, ownProps: Props) => {
  const selectedConverseUUID = _get(
    ownProps,
    'navigation.state.params.uuid',
    ''
  );
  const converseType = ownProps.navigation.getParam('type', 'user');
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
