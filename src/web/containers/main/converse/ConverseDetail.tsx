import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import config from '@shared/project.config';
import {
  showModal,
  hideModal,
  showProfileCard,
} from '@shared/redux/actions/ui';
import { sendMsg, sendFile } from '@shared/redux/actions/chat';
import {
  sendDiceRequest,
  sendDiceInvite,
  sendQuickDice,
} from '@shared/redux/actions/dice';
import DiceRequest from '../dice/DiceRequest';
import DiceInvite from '../dice/DiceInvite';
import QuickDice from '../dice/QuickDice';
import { MsgContainer } from '../../../components/MsgContainer';
import MsgSendBox from '../../../components/MsgSendBox';
import { isUserUUID } from '@shared/utils/uuid';
import { sendStartWriting, sendStopWriting } from '@shared/api/event';
import _throttle from 'lodash/throttle';
import _get from 'lodash/get';
import { TRPGState } from '@redux/types/__all__';
import { MsgType } from '@redux/types/chat';

import './ConverseDetail.scss';

interface Props extends DispatchProp<any> {
  usercache: any;
  converseUUID: string;
  isWriting: boolean;
}
class ConverseDetail extends React.Component<Props> {
  handleSendBoxChange = (text: string) => {
    const { converseUUID } = this.props;

    if (isUserUUID(converseUUID)) {
      // 通知服务器告知converseUUID当前用户正在输入
      if (text === '') {
        // 停止输入
        sendStopWriting('user', converseUUID);
      } else {
        // 正在输入
        sendStartWriting('user', converseUUID);
      }
    }
  };

  handleSendMsg = (message: string, type: MsgType) => {
    const { converseUUID } = this.props;

    console.log('send msg:', message, 'to', converseUUID);
    if (isUserUUID(converseUUID)) {
      // 通知服务器告知converseUUID当前用户停止输入
      sendStopWriting('user', converseUUID);
    }
    this.props.dispatch(
      sendMsg(converseUUID, {
        message,
        is_public: false,
        is_group: false,
        type,
      })
    );
  };

  handleSendFile = (file: File) => {
    console.log('send file to', this.props.converseUUID, file);
    this.props.dispatch(
      sendFile(
        this.props.converseUUID,
        {
          is_public: false,
          is_group: false,
        },
        file
      )
    );
  };

  // 发送投骰请求
  handleSendDiceReq = () => {
    this.props.dispatch(
      showModal(
        <DiceRequest
          onSendDiceRequest={(diceReason, diceExp) => {
            this.props.dispatch(
              sendDiceRequest(
                this.props.converseUUID,
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
  };

  // 发送投骰邀请
  handleSendDiceInv = () => {
    const uuid = this.props.converseUUID;
    console.log('发送投骰邀请', uuid);
    const usercache = this.props.usercache;
    const name =
      _get(usercache, [uuid, 'nickname']) ||
      _get(usercache, [uuid, 'username']);

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
  };

  // 发送自由投骰
  handleQuickDice = () => {
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
  };

  getHeaderActions() {
    const actions = [];
    if (this.props.usercache[this.props.converseUUID]) {
      actions.push({
        name: '个人信息',
        icon: '&#xe611;',
        click: () => {
          this.props.dispatch(showProfileCard(this.props.converseUUID));
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
    const userUUID = this.props.converseUUID;
    const usercache = this.props.usercache;
    const isWriting = this.props.isWriting;

    let name, avatar, desc;
    if (userUUID === 'trpgsystem') {
      name = '系统消息';
      desc = 'TRPG Engine 系统消息';
      avatar = config.defaultImg.trpgsystem;
    } else {
      name =
        _get(usercache, [userUUID, 'nickname']) ||
        _get(usercache, [userUUID, 'username']);
      desc = _get(usercache, [userUUID, 'desc']);
      avatar =
        _get(usercache, [userUUID, 'avatar']) ||
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
          converseUUID={userUUID}
          isGroup={false}
        />
        <MsgSendBox
          converseUUID={userUUID}
          isGroup={false}
          onChange={this.handleSendBoxChange}
          onSendMsg={this.handleSendMsg}
          onSendFile={this.handleSendFile}
          onSendDiceReq={this.handleSendDiceReq}
          onSendDiceInv={this.handleSendDiceInv}
          onQuickDice={this.handleQuickDice}
        />
      </div>
    );
  }
}

export default connect((state: TRPGState) => {
  const converseUUID = state.chat.selectedConverseUUID; // 会话UUID在用户会话中就是用户UUID
  const userWritingList = state.chat.writingList.user ?? [];

  return {
    usercache: state.cache.user,
    converseUUID,
    isWriting: userWritingList.includes(converseUUID),
  };
})(ConverseDetail);
