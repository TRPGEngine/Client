import React from 'react';
import BaseCard from '@capital/web/components/messageTypes/card/BaseCard';
import { connect, DispatchProp } from 'react-redux';
import { showModal } from '@capital/shared/redux/actions/ui';
import config from '@capital/shared/project.config';
import type { MessageProps } from '@capital/shared/components/message/MessageHandler';
import Avatar from '@capital/web/components/Avatar';
import { ActorInfoWithUUID } from '../../modals/ActorInfo';
import { message } from 'antd';

interface Props extends MessageProps, DispatchProp<any> {}

// 人物卡消息
class Actor extends BaseCard<Props> {
  showActorProfile(uuid: string) {
    if (!uuid) {
      message.error('uuid is required!');
      return;
    }

    this.props.dispatch(showModal(<ActorInfoWithUUID uuid={uuid} />));
  }

  getCardView() {
    const info = this.props.info;
    const data = info.data!;
    const url =
      config.file.getAbsolutePath!(data.avatar) || config.defaultImg.actor;
    return (
      <div className="card-content-actor">
        <Avatar className="card-content-avatar" name={data.name} src={url} />
        <div className="card-content-profile">
          <h3>{data.name}</h3>
          <p>{data.desc}</p>
        </div>
      </div>
    );
  }

  getCardBtn() {
    const info = this.props.info;
    const data = info.data!;
    return [
      {
        label: '查看',
        onClick: () => this.showActorProfile(data.uuid),
      },
    ];
  }
}

export default connect()(Actor);
