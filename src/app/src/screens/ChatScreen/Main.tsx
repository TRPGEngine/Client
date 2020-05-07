import React, {
  useCallback,
  useState,
  useRef,
  useMemo,
  useEffect,
  Fragment,
} from 'react';
import { TMemo } from '@shared/components/TMemo';
import { useMsgList } from '@redux/hooks/useMsgList';
import _isArray from 'lodash/isArray';
import _last from 'lodash/last';
import _throttle from 'lodash/throttle';
import _isNil from 'lodash/isNil';
import { View, Text, Keyboard, TextInput } from 'react-native';
import MsgList from './MsgList';
import InputView, { UserMsgType } from './InputView';
import { useCurrentUserInfo } from '@redux/hooks/useUser';
import { useTRPGDispatch } from '@shared/hooks/useTRPGSelector';
import { ChatType } from '@app/types/params';
import { getMoreChatLog, sendMsg, addLoadingMsg } from '@redux/actions/chat';
import { sendStartWriting, sendStopWriting } from '@shared/api/event';
import config from '@shared/project.config';
import { unemojify } from '@shared/utils/emoji';
import { SendMsgPayload } from '@redux/types/chat';
import { getCurrentGroupActor } from '@redux/helpers/group';
import { MsgDataManager } from '@shared/utils/msg-helper';
import QuickDiceModal from '@app/components/chat/QuickDiceModal';
import { sendQuickDice } from '@redux/actions/dice';
import EmotionPanel from '@app/components/chat/EmotionPanel';
import styled from 'styled-components/native';
import ExtraPanelItem from '@app/components/chat/ExtraPanelItem';
import ImagePicker from 'react-native-image-picker';
import { uploadChatimg } from '@shared/utils/image-uploader';
import { useMsgContainerContext } from '@shared/context/MsgContainerContext';
import { MsgReply } from './MsgReply';
import { useGroupWritingState, useWritingState } from '@redux/hooks/useChat';
import { ChatWritingIndicator } from '@app/components/chat/ChatWritingIndicator';

const EXTRA_PANEL_HEIGHT = 220; // 额外面板高度

const ExtraPanel = styled.View`
  height: ${EXTRA_PANEL_HEIGHT};
  background-color: white;
  border-top-width: 1px;
  border-top-color: #ccc;
  flex-direction: row;
`;

interface Props {
  converseUUID: string;
  converseType: ChatType;
}
export const ChatScreenMain: React.FC<Props> = TMemo((props) => {
  const selfInfo = useCurrentUserInfo();
  const { list: msgList, nomore } = useMsgList(props.converseUUID, 'desc');
  const dispatch = useTRPGDispatch();
  const [isKeyboardShow, setIsKeyboardShow] = useState(false);
  const [showExtraPanel, setShowExtraPanel] = useState(false);
  const [showEmoticonPanel, setShowEmoticonPanel] = useState(false);
  const [inputMsg, setInputMsg] = useState('');
  const [msgType, setMsgType] = useState<UserMsgType>('normal');
  const inputRef = useRef<TextInput>();
  const { replyMsg, clearReplyMsg } = useMsgContainerContext();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setIsKeyboardShow(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setIsKeyboardShow(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    // 当当前converseUUID发生变化时，清空回复消息
    clearReplyMsg();
  }, [props.converseUUID]);

  const dismissPanel = useCallback(() => {
    // 收起所有面板
    setShowExtraPanel(false);
    setShowEmoticonPanel(false);
  }, [setShowExtraPanel, setShowEmoticonPanel]);

  const dismissAll = useCallback(() => {
    Keyboard.dismiss();
    dismissPanel();
  }, [dismissPanel]);

  const handleShowEmoticonPanel = useCallback(() => {
    // 显示表情面板
    if (showEmoticonPanel === true) {
      setShowEmoticonPanel(false);
      setShowExtraPanel(false);
      inputRef.current.focus();
    } else {
      setShowEmoticonPanel(true);
      setShowExtraPanel(false);
      inputRef.current.blur();
    }
  }, [showEmoticonPanel, setShowEmoticonPanel, setShowExtraPanel, inputRef]);

  const handleShowExtraPanel = useCallback(() => {
    // 显示额外面板
    if (showExtraPanel === true) {
      setShowExtraPanel(false);
      setShowEmoticonPanel(false);
      inputRef.current.focus();
    } else {
      setShowExtraPanel(true);
      setShowEmoticonPanel(false);
      inputRef.current.blur();
    }
  }, [showExtraPanel, setShowEmoticonPanel, setShowExtraPanel, inputRef]);

  const handleSwitchMsgType = useCallback(
    (msgType: UserMsgType) => {
      setMsgType(msgType);
    },
    [setMsgType]
  );

  /**
   * 处理请求更多聊天记录事件
   */
  const handleRequestMoreChatLog = useCallback(() => {
    // 获取时间最前的那条记录
    const oldestDate = _last(msgList).date ?? new Date().toISOString();
    const converseType = props.converseType;
    dispatch(
      getMoreChatLog(props.converseUUID, oldestDate, converseType === 'user')
    );
  }, [props.converseUUID, props.converseType]);

  const handleChange = useCallback(
    (text: string) => {
      setInputMsg(text);

      if (['user', 'group'].includes(props.converseType)) {
        if (text === '') {
          sendStopWriting(props.converseType, props.converseUUID);
        } else {
          // 发送正在输入信号
          if (props.converseType === 'user') {
            // 通知服务器告知converseUUID当前用户正在输入
            sendStartWriting('user', props.converseUUID);
          } else if (props.converseType === 'group') {
            sendStartWriting('group', props.converseUUID, text);
          }
        }
      }
    },
    [setInputMsg, props.converseUUID, props.converseType]
  );

  /**
   * 向服务器发送信息
   * @param {string} message 要发送的文本
   */
  const sendMsgToServer = useCallback(
    (message: string) => {
      const uuid = props.converseUUID;
      const converseType = props.converseType;

      if (!message) {
        console.warn('require message to send');
      }

      // this.props.onSendMsg(message, type);
      if (!!uuid) {
        message = unemojify(message); // 转成标准文本

        const payload: SendMsgPayload = {
          message,
          type: msgType ?? 'normal',
          is_public: false,
          is_group: false,
        };

        const msgDataManager = new MsgDataManager();
        if (!_isNil(replyMsg)) {
          // NOTE: 应当仅group有效。但是MsgContainerContextProvider因为ant-design/react-native实现的问题只能放在最外层导致无法区分当前状态
          // 因此先放在这里视为所有都能使用回复功能
          msgDataManager.setReplyMsg(replyMsg);
          clearReplyMsg();
        }

        if (converseType === 'user' || converseType === 'system') {
          // 如果是1对1消息
          payload.data = msgDataManager.toJS();
          dispatch(sendMsg(uuid, payload));
        } else if (converseType === 'group') {
          // 如果是群组消息
          payload.converse_uuid = uuid;
          payload.is_public = true;
          payload.is_group = true;

          const currentGroupActor = getCurrentGroupActor(uuid);
          if (!_isNil(currentGroupActor)) {
            msgDataManager.setGroupActorInfo(currentGroupActor);
          }
          payload.data = msgDataManager.toJS();

          dispatch(sendMsg(null, payload));
        }
      }
    },
    [props.converseUUID, props.converseType, msgType, replyMsg, clearReplyMsg]
  );

  const handleSendMsg = useCallback(() => {
    const message = inputMsg.trim();
    if (!!message) {
      sendMsgToServer(message);
      setInputMsg('');
    }
  }, [inputMsg, setInputMsg, sendMsgToServer]);

  const [showQuickDiceModal, setShowQuickDiceModal] = useState(false);
  const handleSendQuickDice = useCallback(
    (diceExp: string) => {
      const uuid = props.converseUUID;
      const converseType = props.converseType;
      const isGroup = converseType === 'group';
      dispatch(sendQuickDice(uuid, isGroup, diceExp));
      setShowQuickDiceModal(false);
    },
    [props.converseUUID, props.converseType, setShowQuickDiceModal]
  );
  const modalEl = useMemo(() => {
    return (
      <Fragment>
        <QuickDiceModal
          visible={showQuickDiceModal}
          onClose={() => setShowQuickDiceModal(false)}
          onSend={handleSendQuickDice}
        />
      </Fragment>
    );
  }, [showQuickDiceModal, setShowQuickDiceModal, handleSendQuickDice]);

  const emotionPanelEl = useMemo(() => {
    // 表情面板的渲染函数
    return (
      <EmotionPanel
        onSelectEmoji={(code) => {
          // 增加到输入框
          const newMsg = inputMsg + code;
          setInputMsg(newMsg);
        }}
        onSelectEmotion={(emotionUrl) =>
          sendMsgToServer(`[img]${emotionUrl}[/img]`)
        }
      />
    );
  }, [inputMsg, setInputMsg, sendMsgToServer]);

  const handleSendImage = useCallback(() => {
    // 额外面板的发送图片功能
    ImagePicker.launchImageLibrary(
      {
        mediaType: 'photo',
        allowsEditing: true,
        maxWidth: 1200,
        maxHeight: 1200,
      },
      (response) => {
        dismissAll();

        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          const file = {
            uri: response.uri,
            type: response.type,
            name: response.fileName,
          } as any;

          const uuid = props.converseUUID;
          dispatch(
            addLoadingMsg(uuid, ({ updateProgress, removeLoading }) => {
              uploadChatimg(file, {
                onUploadProgress(percent) {
                  updateProgress(percent); // 更新loading百分比
                },
              }).then((imageUrl) => {
                removeLoading(); // 移除loading消息
                const message = `[img]${imageUrl}[/img]`;
                console.log('message', message);
                sendMsgToServer(message);
              });
            })
          );
        }
      }
    );
  }, [dismissAll, props.converseUUID, dispatch, sendMsgToServer]);
  const extraPanelEl = useMemo(() => {
    return (
      <ExtraPanel>
        <ExtraPanelItem
          text="发送图片"
          icon="&#xe621;"
          onPress={handleSendImage}
        />
        <ExtraPanelItem
          text="投骰"
          icon="&#xe629;"
          onPress={() => setShowQuickDiceModal(true)}
        />
      </ExtraPanel>
    );
  }, [handleSendImage, setShowQuickDiceModal]);

  if (!_isArray(msgList)) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  const writingList = useWritingState(props.converseUUID, props.converseType);

  return (
    <View style={{ flex: 1 }}>
      <ChatWritingIndicator list={writingList} />
      <MsgList
        msgList={msgList}
        selfInfo={selfInfo}
        nomore={nomore}
        onTouchStart={dismissAll}
        onRequestMoreChatLog={handleRequestMoreChatLog}
      />
      <MsgReply />
      <InputView
        inputRef={inputRef}
        value={inputMsg}
        msgType={msgType}
        onChange={handleChange}
        onSendMsg={handleSendMsg}
        onFocus={dismissPanel}
        onShowEmoticonPanel={handleShowEmoticonPanel}
        onShowExtraPanel={handleShowExtraPanel}
        onChangeMsgType={handleSwitchMsgType}
      />
      {showEmoticonPanel &&
        !showExtraPanel &&
        !isKeyboardShow &&
        emotionPanelEl}
      {showExtraPanel && !showEmoticonPanel && !isKeyboardShow && extraPanelEl}
      {modalEl}
    </View>
  );
});
ChatScreenMain.displayName = 'ChatScreenMain';
