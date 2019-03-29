const React = require('react');
const BaseCard = require('./BaseCard');
const { connect } = require('react-redux');
const { showModal } = require('../../../../redux/actions/ui');
const { getActorInfo } = require('../../../../redux/actions/cache');
const config = require('../../../../../config/project.config');

// 投骰请求
class Actor extends BaseCard {
  showActorProfile(uuid) {
    if (!uuid) {
      console.error('uuid is required!');
      return;
    }
    // 获取最新信息
    const ActorCacheProfile = require('../../modal/ActorCacheProfile');
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

module.exports = connect()(Actor);
