import React from 'react';
import PropTypes from 'prop-types';
import { connect, DispatchProp } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import Emoticon from './Emoticon';
import * as pasteUtils from '../../shared/utils/paste-utils';
import { sendMsg } from '../../shared/redux/actions/chat';
import { showModal, hideModal } from '../../shared/redux/actions/ui';
import ActorSelect from './modal/ActorSelect';
import config from '../../shared/project.config';
import ContentEditable from 'react-contenteditable';

import './MsgSendBox.scss';

const MsgEditor = ContentEditable as any;

interface Props extends DispatchProp<any> {
  userUUID: string;
  converseUUID: string;
  isGroup: boolean;
  onQuickDice: () => void;
  onChange: (val: string) => void;
  onSendMsg: (message: string, type: any) => void;
  onSendFile: (file: File) => void;
  onSendDiceReq: () => void;
  onSendDiceInv: () => void;
}
class MsgSendBox extends React.Component<Props> {
  inputMsgRef = React.createRef<HTMLElement>();
  fileUploader = React.createRef<HTMLInputElement>();
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
    this.inputMsgRef.current.focus();
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.hidePopup);
  }

  handleMsgInputChange(e) {
    this.setState({ inputMsg: e.target.value });
    this.props.onChange && this.props.onChange(e.target.value); // 事件向上传递
  }

  handleMsgInputKeyDown(e) {
    if (e.keyCode === 9) {
      e.preventDefault();
      let index = this.inputType.findIndex(
        (item) => item.type === this.state.inputType
      );
      if (!e.shiftKey) {
        // 正向
        let i = (index + 1) % this.inputType.length;
        this.setState({ inputType: this.inputType[i].type });
      } else {
        // 反向
        let i = (index + this.inputType.length - 1) % this.inputType.length;
        this.setState({ inputType: this.inputType[i].type });
      }
    }

    if (e.keyCode === 13 && !e.shiftKey) {
      // 发送信息
      e.preventDefault();
    }
  }

  handleMsgInputKeyUp(e) {
    if (e.keyCode === 13 && !e.shiftKey) {
      this.handleSendMsg();
    }
  }

  async handlePaste(e) {
    if (e.clipboardData && e.clipboardData.items) {
      let image = pasteUtils.isPasteImage(e.clipboardData.items);
      if (image) {
        // 上传图片
        e.preventDefault();
        let file = image.getAsFile();
        let data = await pasteUtils.upload(this.props.userUUID, file);
        if (data && data.chatimg) {
          console.log(data);
          this.setState({
            inputMsg: this.state.inputMsg + `[img]${data.chatimg.url}[/img]`,
          });
        }
      }
    }
  }

  handleSendMsg() {
    let message = this.state.inputMsg.trim();
    let type = this.state.inputType;
    if (!!message) {
      this.props.onSendMsg(message, type);
      this.inputMsgRef.current.focus();
      this.setState({ inputMsg: '' });
    }
  }

  // 显示选择表情弹出框
  handleShowEmoticon() {
    this.setState({ showEmoticon: !this.state.showEmoticon });
    setTimeout(() => window.addEventListener('click', this.hidePopup), 0);
  }

  handleSelectEmoticon(code) {
    this.setState({ inputMsg: this.state.inputMsg + code });
    this.hidePopup();
    this.inputMsgRef.current.focus();
  }

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
            let { converseUUID, isGroup } = this.props;
            if (isGroup) {
              // 发送到团
              this.props.dispatch(
                sendMsg(null, {
                  converse_uuid: converseUUID,
                  type: 'card',
                  message: '[人物卡]',
                  is_public: isGroup,
                  data: {
                    type: 'actor',
                    uuid: actorUUID,
                    avatar: config.file.getRelativePath(actorInfo.avatar),
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
                  is_public: isGroup,
                  data: {
                    type: 'actor',
                    uuid: actorUUID,
                    avatar: config.file.getRelativePath(actorInfo.avatar),
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
    let files = e.dataTransfer.files;
    for (let f of files) {
      this.props.onSendFile && this.props.onSendFile(f);
    }
  }

  handleFileUploaderChange() {
    let files = this.fileUploader.current.files as any;
    for (let f of files) {
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
              <Emoticon onSelect={(code) => this.handleSelectEmoticon(code)} />
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
          <MsgEditor
            innerRef={this.inputMsgRef}
            className="input-msg"
            tagName="pre"
            html={this.state.inputMsg}
            disabled={false}
            onChange={(e) => this.handleMsgInputChange(e)}
            onKeyDown={(e) => this.handleMsgInputKeyDown(e)}
            onKeyUp={(e) => this.handleMsgInputKeyUp(e)}
            onPaste={(e) => this.handlePaste(e)}
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

export default connect((state: any) => ({
  userUUID: state.getIn(['user', 'info', 'uuid']),
}))(MsgSendBox);
