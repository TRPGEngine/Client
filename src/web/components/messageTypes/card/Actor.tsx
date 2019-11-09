import React from 'react';
import BaseCard from './BaseCard';
import { connect, DispatchProp } from 'react-redux';
import { showModal } from '@shared/redux/actions/ui';
import { getActorInfo } from '@shared/redux/actions/cache';
import config from '@shared/project.config';
import ActorCacheProfile from '../../modal/ActorCacheProfile';
import { MessageProps } from '@src/shared/components/MessageHandler';

interface Props extends MessageProps, DispatchProp<any> {}

// 投骰请求
class Actor extends BaseCard<Props> {
  showActorProfile(uuid: string) {
    if (!uuid) {
      console.error('uuid is required!');
      return;
    }
    // 获取最新信息
    this.props.dispatch(getActorInfo(uuid)); // TODO: 需要实现actor的缓存工具
    this.props.dispatch(showModal(<ActorCacheProfile uuid={uuid} />));
  }

  getCardView() {
    let info = this.props.info;
    let data = info.data;
    let url =
      config.file.getAbsolutePath(data.avatar) || config.defaultImg.actor;
    return (
      <div className="card-content-actor">
        <div
          className="card-content-avatar"
          style={{ backgroundImage: `url(${url})` }}
        />
        <div className="card-content-profile">
          <h3>{data.name}</h3>
          <p>{data.desc}</p>
        </div>
      </div>
    );
  }

  getCardBtn() {
    let info = this.props.info;
    let data = info.data;
    return [
      {
        label: '查看',
        onClick: () => this.showActorProfile(data.uuid),
      },
    ];
  }
}

export default connect()(Actor);
