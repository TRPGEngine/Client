import React from 'react';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import EmojiPanel from './EmojiPanel';
import * as pasteUtils from '@shared/utils/paste-utils';
import { sendMsg } from '@shared/redux/actions/chat';
import { showModal, hideModal } from '@shared/redux/actions/ui';
import ActorSelect from './modals/ActorSelect';
import config from '@shared/project.config';
import { TRPGState, TRPGDispatchProp } from '@redux/types/__all__';
import { Mentions } from 'antd';

import './MsgSendBox.scss';

const msgMaxLength = config.chat.maxLength;

interface Props extends TRPGDispatchProp {
  userUUID: string;
  converseUUID: string;
  isGroup: boolean;
  onQuickDice: () => void;
  onChange?: (val: string) => void;
  onSendMsg: (message: string, type: any) => void;
  onSendFile: (file: File) => void;
  onSendDiceReq: () => void;
  onSendDiceInv: () => void;
}
class MsgSendBox extends React.Component<Props> {
  inputMsgRef = React.createRef<HTMLElement>();
  fileUploader = React.createRef<HTMLInputElement>();
  inputIME = false;
  state = {
    inputMsg: '',
    inputType: 'normal',
    showEmoticon: false,
    showDiceMethods: false,
  };
  clickableBtn = [
    {
      label: '发送表情',
      icon: '&#xe683;',
      onClick: (e) => {
        e.stopPropagation();
        this.handleShowEmoticon();
      },
    },
    {
      label: '发送人物卡',
      icon: '&#xe61b;',
      onClick: (e) => this.handleShowSendActor(),
    },
    {
      label: '发送文件',
      icon: '&#xe640;',
      onClick: (e) =>
        this.fileUploader &&
        this.fileUploader.current &&
        this.fileUploader.current.click(),
    },
  ];
  inputType = [
    {
      label: '普通信息',
      type: 'normal',
      icon: '&#xe72d;',
    },
    {
      label: '吐槽信息',
      type: 'ooc',
      icon: '&#xe64d;',
    },
    {
      label: '对话信息',
      type: 'speak',
      icon: '&#xe61f;',
    },
    {
      label: '行动信息',
      type: 'action',
      icon: '&#xe619;',
    },
  ];

  actions = [
    {
      label: '',
      icon: '&#xe631;',
      onClick: () => this.handleShowDiceMethods(),
    },
  ];

  hidePopup = () => {
    window.removeEventListener('click', this.hidePopup);
    this.setState({
      showEmoticon: false,
      showDiceMethods: false,
    });
  };

  constructor(props) {
    super(props);
    if (this.props.onQuickDice) {
      this.actions.unshift({
        label: '快速投骰',
        icon: '&#xe609;',
        onClick: () => this.props.onQuickDice(),
      });
    }
  }

  componentDidMount() {
    this.inputMsgRef.current!.focus();
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.hidePopup);
  }

  handleMsgInputChange = (text: string) => {
    this.setState({ inputMsg: text });
    this.props.onChange && this.props.onChange(text); // 事件向上传递
  };

  handleMsgInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.keyCode === 9) {
      e.preventDefault();
      const index = this.inputType.findIndex(
        (item) => item.type === this.state.inputType
      );
      if (!e.shiftKey) {
        // 正向
        const i = (index + 1) % this.inputType.length;
        this.setState({ inputType: this.inputType[i].type });
      } else {
        // 反向
        const i = (index + this.inputType.length - 1) % this.inputType.length;
        this.setState({ inputType: this.inputType[i].type });
      }
    }

    if (e.keyCode === 13 && !e.shiftKey) {
      // 发送信息
      e.preventDefault();
    }
  };

  handleMsgInputKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.keyCode === 13 && !e.shiftKey && !this.inputIME) {
      // 当按下回车且没有按下shift且不是输入法模式
      this.handleSendMsg();
    }
  };

  handleCompositionStart = () => {
    this.inputIME = true;
  };

  handleCompositionEnd = () => {
    setTimeout(() => {
      // 给一个时间，因为该事件的触发时间在handleMsgInputKeyUp前
      this.inputIME = false;
    }, 100);
  };

  handlePaste = async (e: React.ClipboardEvent) => {
    if (e.clipboardData && e.clipboardData.items) {
      const image = pasteUtils.isPasteImage(e.clipboardData.items);
      if (image) {
        // 上传图片
        e.preventDefault();
        const file = image.getAsFile();
        const chatimgUrl = await pasteUtils.upload(file!);
        if (chatimgUrl) {
          this.setState({
            inputMsg: this.state.inputMsg + `[img]${chatimgUrl}[/img]`,
          });
        }
      }
    }
  };

  handleSendMsg() {
    const message = this.state.inputMsg.trim();
    const type = this.state.inputType;
    if (!!message) {
      this.props.onSendMsg(message, type);
      this.inputMsgRef.current!.focus();
      this.setState({ inputMsg: '' });
    }
  }

  // 显示选择表情弹出框
  handleShowEmoticon() {
    this.setState({ showEmoticon: !this.state.showEmoticon });
    setTimeout(() => window.addEventListener('click', this.hidePopup), 0);
  }

  handleEmoticonClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
  };

  handleSelectEmoticon = (code: string) => {
    this.setState({ inputMsg: this.state.inputMsg + code });
    this.hidePopup();
    this.inputMsgRef.current!.focus();
  };

  // 显示投骰方式弹出框
  handleShowDiceMethods() {
    this.setState({ showDiceMethods: !this.state.showDiceMethods });
    setTimeout(() => window.addEventListener('click', this.hidePopup), 0);
  }

  // 发送人物卡
  handleShowSendActor() {
    console.log('发送人物卡');
    this.props.dispatch(
      showModal(
        <ActorSelect
          onSelect={(actorUUID, actorInfo) => {
            this.props.dispatch(hideModal());
            console.log('人物卡信息', actorUUID, actorInfo);
            const { converseUUID, isGroup } = this.props;
            if (isGroup) {
              // 发送到团
              this.props.dispatch(
                sendMsg(null, {
                  converse_uuid: converseUUID,
                  type: 'card',
                  message: '[人物卡]',
                  is_group: isGroup,
                  is_public: isGroup,
                  data: {
                    type: 'actor',
                    uuid: actorUUID,
                    avatar: config.file.getRelativePath!(actorInfo.avatar),
                    name: actorInfo.name,
                    desc: actorInfo.desc,
                  },
                })
              );
            } else {
              this.props.dispatch(
                sendMsg(converseUUID, {
                  type: 'card',
                  message: '[人物卡]',
                  is_group: isGroup,
                  is_public: isGroup,
                  data: {
                    type: 'actor',
                    uuid: actorUUID,
                    avatar: config.file.getRelativePath!(actorInfo.avatar),
                    name: actorInfo.name,
                    desc: actorInfo.desc,
                  },
                })
              );
            }
          }}
        />
      )
    );
  }

  handleContainerDrop(e) {
    e.preventDefault();
    const files = e.dataTransfer.files;
    for (const f of files) {
      this.props.onSendFile && this.props.onSendFile(f);
    }
  }

  handleFileUploaderChange() {
    const files = this.fileUploader.current!.files as any;
    for (const f of files) {
      this.props.onSendFile && this.props.onSendFile(f);
    }
  }

  render() {
    return (
      <div
        className="send-msg-box"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => this.handleContainerDrop(e)}
      >
        <div className="input-area">
          <div className="tool-area">
            <div
              className={
                'popup emoticon' + (this.state.showEmoticon ? ' active' : '')
              }
            >
              <EmojiPanel
                style={{ position: 'relative', display: 'block' }}
                onClick={this.handleEmoticonClick}
                onSelect={this.handleSelectEmoticon}
              />
            </div>

            <div
              className={
                'popup dice' + (this.state.showDiceMethods ? ' active' : '')
              }
            >
              <ul>
                <li
                  onClick={() =>
                    this.props.onSendDiceReq && this.props.onSendDiceReq()
                  }
                >
                  请求投骰
                </li>
                <li
                  onClick={() =>
                    this.props.onSendDiceInv && this.props.onSendDiceInv()
                  }
                >
                  邀请投骰
                </li>
              </ul>
            </div>
            <ReactTooltip effect="solid" />
            <input
              type="file"
              ref={this.fileUploader}
              onChange={() => this.handleFileUploaderChange()}
              style={{ display: 'none' }}
            />
            <div className="btn-group">
              {this.clickableBtn.map((item, index) => {
                return (
                  <div
                    key={'btn-group#' + index}
                    data-tip={item.label}
                    className="tool-item"
                    onClick={(e) => !!item.onClick && item.onClick(e)}
                  >
                    <i
                      className="iconfont"
                      dangerouslySetInnerHTML={{ __html: item.icon }}
                    />
                  </div>
                );
              })}
            </div>
            <div className="type-select">
              {this.inputType.map((item, index) => {
                return (
                  <div
                    key={'input-type#' + index}
                    data-tip={item.label}
                    className={
                      this.state.inputType === item.type
                        ? 'tool-item active'
                        : 'tool-item'
                    }
                    onClick={() => this.setState({ inputType: item.type })}
                  >
                    <i
                      className="iconfont"
                      dangerouslySetInnerHTML={{ __html: item.icon }}
                    />
                  </div>
                );
              })}
            </div>
            <div className="input-actions">
              {this.actions.map((item, index) => {
                return (
                  <div
                    key={'input-action#' + index}
                    data-tip={item.label}
                    className="tool-item"
                    onClick={() => (item.onClick ? item.onClick() : '')}
                  >
                    <i
                      className="iconfont"
                      dangerouslySetInnerHTML={{ __html: item.icon }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
          <Mentions
            ref={this.inputMsgRef}
            className="input-msg"
            value={this.state.inputMsg}
            maxLength={msgMaxLength}
            disabled={false}
            onChange={this.handleMsgInputChange}
            onKeyDownCapture={this.handleMsgInputKeyDown}
            onKeyUpCapture={this.handleMsgInputKeyUp}
            onCompositionStart={this.handleCompositionStart}
            onCompositionEnd={this.handleCompositionEnd}
            onPaste={this.handlePaste}
            autoFocus={true}
          />
        </div>
        <div className="action-area">
          <button
            onClick={() => this.handleSendMsg()}
            disabled={this.state.inputMsg ? false : true}
          >
            发送&lt;Enter&gt;
          </button>
        </div>
      </div>
    );
  }
}

export default connect((state: TRPGState) => ({
  userUUID: state.user.info.uuid,
}))(MsgSendBox);
