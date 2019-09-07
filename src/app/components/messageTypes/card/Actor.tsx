import React from 'react';
import { Text, View, Image } from 'react-native';
import sb from 'react-native-style-block';
import BaseCard from './BaseCard';
import { connect } from 'react-redux';
import { showModal } from '../../../../shared/redux/actions/ui';
import { getActorInfo } from '../../../../shared/redux/actions/cache';
import config from '../../../../shared/project.config';

// TODO: 设置为APP可用的消息类型渲染
// 投骰请求
class Actor extends BaseCard {
  showActorProfile(uuid) {
    if (!uuid) {
      console.error('uuid is required!');
      return;
    }

    alert('TODO: 查看人物卡');
    // 获取最新信息
    // TODO: 打开网页显示人物卡信息
    // import ActorCacheProfile from '../../modal/ActorCacheProfile';
    // this.props.dispatch(getActorInfo(uuid));// TODO: 需要实现actor的缓存工具
    // this.props.dispatch(showModal(
    //   <ActorCacheProfile uuid={uuid} />
    // ))
  }

  getCardView() {
    let info = this.props.info;
    let data = info.data;
    let imgUrl =
      config.file.getAbsolutePath(data.avatar) || config.defaultImg.actor;

    return (
      <View style={styles.container}>
        <Image style={styles.image} source={{ uri: imgUrl }} />
        <View style={styles.props}>
          <Text>{data.name}</Text>
          <Text>{data.desc}</Text>
        </View>
      </View>
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

const styles = {
  container: [sb.direction(), sb.size(240)],
  image: [sb.size(60, 80), sb.margin(2)],
  props: [sb.flex(), sb.padding(4)],
};

export default connect()(Actor);
