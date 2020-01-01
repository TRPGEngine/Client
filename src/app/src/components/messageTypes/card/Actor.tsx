import React from 'react';
import { Text, View, Image } from 'react-native';
import sb from 'react-native-style-block';
import BaseCard from './BaseCard';
import { connect } from 'react-redux';
import config from '@shared/project.config';
import { TRPGDispatchProp } from '@redux/types/__all__';
import { navPortal } from '@app/redux/actions/nav';
import { MessageProps } from '@shared/components/MessageHandler';
import { TAvatar } from '@app/components/TComponent';

// 投骰请求
interface Props extends TRPGDispatchProp, MessageProps {}
class Actor extends BaseCard<Props> {
  showActorProfile(uuid: string) {
    if (!uuid) {
      console.error('uuid is required!');
      return;
    }

    // 获取最新信息
    this.props.dispatch(navPortal(`/actor/detail/${uuid}`));
  }

  getCardView() {
    const info = this.props.info;
    const data = info.data;
    const imgUrl =
      config.file.getAbsolutePath(data.avatar) || config.defaultImg.actor;

    return (
      <View style={styles.container}>
        <TAvatar name={data.name} uri={imgUrl} style={styles.image} />
        <View style={styles.props}>
          <Text>{data.name}</Text>
          <Text>{data.desc}</Text>
        </View>
      </View>
    );
  }

  getCardBtn() {
    const info = this.props.info;
    const data = info.data;
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
  image: [
    sb.size(60, 60),
    sb.margin(2),
    {
      borderRadius: 3,
    },
  ],
  props: [sb.flex(), sb.padding(4)],
};

export default connect()(Actor);
