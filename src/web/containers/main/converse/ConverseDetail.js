import React from 'react';
import { connect } from 'react-redux';
import config from '../../../../../config/project.config.js';
import {
  showModal,
  hideModal,
  showProfileCard,
} from '../../../../redux/actions/ui';
import { sendMsg, sendFile } from '../../../../redux/actions/chat';
import {
  sendDiceRequest,
  sendDiceInvite,
  sendQuickDice,
} from '../../../../redux/actions/dice';
import DiceRequest from '../dice/DiceRequest';
import DiceInvite from '../dice/DiceInvite';
import QuickDice from '../dice/QuickDice';
import MsgContainer from '../../../components/MsgContainer';
import MsgSendBox from '../../../components/MsgSendBox';
import { isUserUUID } from '../../../../shared/utils/uuid.js';
import { sendStartWriting, sendStopWriting } from '../../../../api/event';
import _throttle from 'lodash/throttle';

import './ConverseDetail.scss';

class ConverseDetail extends React.Component {
  constructor(props) {
    super(props);
    this.sendWritingThrottled = _throttle(
      () => {
        // 发送正在输入信号
        sendStartWriting('user', this.props.converseUserUUID);
      },
      2000,
      { leading: true, trailing: false }
    );
  }

  _handleSendBoxChange(text) {
    if (isUserUUID(this.props.converseUserUUID)) {
      // 通知服务器告知converseUserUUID当前用户正在输入
      // 增加一个2秒的节流防止频繁发送
      this.sendWritingThrottled();
    }
  }

  _handleSendMsg(message, type) {
    const { converseUUID, converseUserUUID } = this.props;

    console.log(
      'send msg:',
      message,
      'to',
      converseUserUUID,
      'in converse',
      converseUUID
    );
    if (isUserUUID(converseUserUUID)) {
      // 通知服务器告知converseUserUUID当前用户停止输入
      sendStopWriting('user', converseUserUUID);
    }
    this.props.dispatch(
      sendMsg(converseUserUUID, {
        message,
        is_public: false,
        is_group: false,
        type,
      })
    );
  }

  _handleSendFile(file) {
    console.log('send file to', this.props.converseUserUUID, file);
    this.props.dispatch(
      sendFile(
        this.props.converseUserUUID,
        {
          is_public: false,
          is_group: false,
        },
        file
      )
    );
  }

  // 发送投骰请求
  _handleSendDiceReq() {
    this.props.dispatch(
      showModal(
        <DiceRequest
          onSendDiceRequest={(diceReason, diceExp) => {
            this.props.dispatch(
              sendDiceRequest(
                this.props.converseUserUUID,
                false,
                diceExp,
                diceReason
              )
            );
            this.props.dispatch(hideModal());
          }}
        />
      )
    );
  }

  // 发送投骰邀请
  _handleSendDiceInv() {
    let uuid = this.props.converseUUID;
    console.log('发送投骰邀请', uuid);
    let usercache = this.props.usercache;
    let name =
      usercache.getIn([uuid, 'nickname']) ||
      usercache.getIn([uuid, 'username']);
    this.props.dispatch(
      showModal(
        <DiceInvite
          inviteList={[name]}
          onSendDiceInvite={(diceReason, diceExp) => {
            console.log('diceReason, diceExp', diceReason, diceExp);
            this.props.dispatch(
              sendDiceInvite(uuid, false, diceExp, diceReason, [uuid], [name])
            );
            this.props.dispatch(hideModal());
          }}
        />
      )
    );
  }

  // 发送自由投骰
  _handleQuickDice() {
    console.log('快速投骰');
    let uuid = this.props.converseUUID;
    this.props.dispatch(
      showModal(
        <QuickDice
          onSendQuickDice={(diceExp) => {
            this.props.dispatch(sendQuickDice(uuid, false, diceExp));
            this.props.dispatch(hideModal());
          }}
        />
      )
    );
  }

  getHeaderActions() {
    const actions = [];
    if (this.props.usercache.get(this.props.converseUserUUID)) {
      actions.push({
        name: '个人信息',
        icon: '&#xe611;',
        click: () => {
          this.props.dispatch(showProfileCard(this.props.converseUserUUID));
        },
      });
    }

    return actions.map((item, index) => {
      return (
        <button
          key={'group-action-' + index}
          data-tip={item.name}
          onClick={(e) => {
            e.stopPropagation();
            item.click();
          }}
        >
          <i
            className="iconfont"
            dangerouslySetInnerHTML={{ __html: item.icon }}
          />
        </button>
      );
    });
  }

  render() {
    const userUUID = this.props.converseUserUUID;
    const usercache = this.props.usercache;
    const isWriting = this.props.isWriting;

    let name, avatar, desc;
    if (userUUID === 'trpgsystem') {
      name = '系统消息';
      desc = 'TRPG Engine 系统消息';
      avatar = config.defaultImg.trpgsystem;
    } else {
      name =
        usercache.getIn([userUUID, 'nickname']) ||
        usercache.getIn([userUUID, 'username']);
      desc = usercache.getIn([userUUID, 'desc']);
      avatar =
        usercache.getIn([userUUID, 'avatar']) ||
        config.defaultImg.getUser(name);
    }
    return (
      <div className="conv-detail">
        <div className="conv-header">
          <div className="avatar">
            <img src={avatar} />
          </div>
          <div className="title">
            <div className="main-title">
              {name}
              {isWriting ? <small>(正在输入...)</small> : null}
            </div>
            <div className="sub-title">{desc}</div>
          </div>
          <div className="actions">{this.getHeaderActions()}</div>
        </div>
        <MsgContainer
          className="conv-container"
          converseUUID={this.props.converseUUID}
          converseUserUUID={userUUID}
          isGroup={false}
        />
        <MsgSendBox
          converseUUID={this.props.converseUUID}
          isGroup={false}
          onChange={(text) => this._handleSendBoxChange(text)}
          onSendMsg={(message, type) => this._handleSendMsg(message, type)}
          onSendFile={(file) => this._handleSendFile(file)}
          onSendDiceReq={() => this._handleSendDiceReq()}
          onSendDiceInv={() => this._handleSendDiceInv()}
          onQuickDice={() => this._handleQuickDice()}
        />
      </div>
    );
  }
}

export default connect((state) => {
  const converseUUID = state.getIn(['chat', 'selectedConversesUUID']);
  const converseUserUUID = state.getIn(['chat', 'selectedConversesUserUUID']);
  const userWritingList = state.getIn(['chat', 'writingList', 'user'], []);

  return {
    userUUID: state.getIn(['user', 'info', 'uuid']),
    selfInfo: state.getIn(['user', 'info']),
    usercache: state.getIn(['cache', 'user']),
    converseUUID,
    converseUserUUID,
    isWriting: userWritingList.includes(converseUserUUID),
  };
})(ConverseDetail);
