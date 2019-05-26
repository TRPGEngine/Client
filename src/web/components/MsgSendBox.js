import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import Emoticon from './Emoticon';
import * as pasteUtils from '../../shared/utils/pasteUtils';
import { sendMsg } from '../../redux/actions/chat';
import { showModal, hideModal } from '../../redux/actions/ui';
import ActorSelect from './modal/ActorSelect';
import config from '../../../config/project.config';
import ContentEditable from 'react-contenteditable';

import './MsgSendBox.scss';

class MsgSendBox extends React.Component {
  constructor(props) {
    super(props);
    this.inputMsgRef = React.createRef();
    this.state = {
      inputMsg: '',
      inputType: 'normal',
      showEmoticon: false,
      showDiceMethods: false,
    };
    this.clickableBtn = [
      {
        label: '发送表情',
        icon: '&#xe683;',
        onClick: (e) => {
          e.stopPropagation();
          this._handleShowEmoticon();
        },
      },
      {
        label: '发送人物卡',
        icon: '&#xe61b;',
        onClick: (e) => this._handleShowSendActor(),
      },
      {
        label: '发送文件',
        icon: '&#xe640;',
        onClick: (e) =>
          this.refs.fileUploader && this.refs.fileUploader.click(),
      },
    ];
    this.inputType = [
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
    this.actions = [
      {
        label: '',
        icon: '&#xe631;',
        onClick: () => this._handleShowDiceMethods(),
      },
    ];
    if (this.props.onQuickDice) {
      this.actions.unshift({
        label: '快速投骰',
        icon: '&#xe609;',
        onClick: () => this.props.onQuickDice(),
      });
    }
    this.hidePopup = () => {
      window.removeEventListener('click', this.hidePopup);
      this.setState({
        showEmoticon: false,
        showDiceMethods: false,
      });
    };
  }

  componentDidMount() {
    this.inputMsgRef.current.focus();
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.hidePopup);
  }

  _handleMsgInputChange(e) {
    this.setState({ inputMsg: e.target.value });
    this.props.onChange && this.props.onChange(e.target.value); // 事件向上传递
  }

  _handleMsgInputKeyDown(e) {
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

  _handleMsgInputKeyUp(e) {
    if (e.keyCode === 13 && !e.shiftKey) {
      this._handleSendMsg();
    }
  }

  async _handlePaste(e) {
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

  _handleSendMsg() {
    let message = this.state.inputMsg.trim();
    let type = this.state.inputType;
    if (!!message) {
      this.props.onSendMsg(message, type);
      this.inputMsgRef.current.focus();
      this.setState({ inputMsg: '' });
    }
  }

  // 显示选择表情弹出框
  _handleShowEmoticon() {
    this.setState({ showEmoticon: !this.state.showEmoticon });
    setTimeout(() => window.addEventListener('click', this.hidePopup), 0);
  }

  _handleSelectEmoticon(code) {
    this.setState({ inputMsg: this.state.inputMsg + code });
    this.hidePopup();
    this.inputMsgRef.current.focus();
  }

  // 显示投骰方式弹出框
  _handleShowDiceMethods() {
    this.setState({ showDiceMethods: !this.state.showDiceMethods });
    setTimeout(() => window.addEventListener('click', this.hidePopup), 0);
  }

  // 发送人物卡
  _handleShowSendActor() {
    console.log('发送人物卡');
    this.props.dispatch(
      showModal(
        <ActorSelect
          onSelect={(actorUUID, actorInfo) => {
            this.props.dispatch(hideModal());
            console.log('人物卡信息', actorUUID, actorInfo);
            let { converseUUID, isGroup } = this.props;
            this.props.dispatch(
              sendMsg(converseUUID, {
                room: isGroup ? converseUUID : '',
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
          }}
        />
      )
    );
  }

  _handleContainerDrop(e) {
    e.preventDefault();
    let files = e.dataTransfer.files;
    for (let f of files) {
      this.props.onSendFile && this.props.onSendFile(f);
    }
  }

  _handleFileUploaderChange() {
    let files = this.refs.fileUploader.files;
    for (let f of files) {
      this.props.onSendFile && this.props.onSendFile(f);
    }
  }

  render() {
    return (
      <div
        className="send-msg-box"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => this._handleContainerDrop(e)}
      >
        <div className="input-area">
          <div className="tool-area">
            <div
              className={
                'popup emoticon' + (this.state.showEmoticon ? ' active' : '')
              }
            >
              <Emoticon onSelect={(code) => this._handleSelectEmoticon(code)} />
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
              ref="fileUploader"
              onChange={() => this._handleFileUploaderChange()}
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
          <ContentEditable
            innerRef={this.inputMsgRef}
            className="input-msg"
            tagName="pre"
            html={this.state.inputMsg}
            disabled={false}
            onChange={(e) => this._handleMsgInputChange(e)}
            onKeyDown={(e) => this._handleMsgInputKeyDown(e)}
            onKeyUp={(e) => this._handleMsgInputKeyUp(e)}
            onPaste={(e) => this._handlePaste(e)}
          />
        </div>
        <div className="action-area">
          <button
            onClick={() => this._handleSendMsg()}
            disabled={this.state.inputMsg ? false : true}
          >
            发送&lt;Enter&gt;
          </button>
        </div>
      </div>
    );
  }
}

MsgSendBox.propTypes = {
  conversesUUID: PropTypes.string,
  isRoom: PropTypes.bool,
};

export default connect((state) => ({
  userUUID: state.getIn(['user', 'info', 'uuid']),
}))(MsgSendBox);
