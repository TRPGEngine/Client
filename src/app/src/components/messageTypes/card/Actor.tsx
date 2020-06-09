import React from 'react';
import { Text, View, Image } from 'react-native';
import sb from 'react-native-style-block';
import BaseCard from './BaseCard';
import { connect } from 'react-redux';
import config from '@shared/project.config';
import { MessageProps } from '@shared/components/message/MessageHandler';
import { TAvatar } from '@app/components/TComponent';
import { TRPGStackScreenProps, useTRPGStackNavigation } from '@app/router';
import { navPortal } from '@app/navigate';
import { useNavigation } from '@react-navigation/native';

// 投骰请求
interface Props
  extends MessageProps,
    Pick<TRPGStackScreenProps<'Chat'>, 'navigation'> {}
class Actor extends BaseCard<Props> {
  showActorProfile(uuid: string) {
    if (!uuid) {
      console.error('uuid is required!');
      return;
    }

    // 获取最新信息
    navPortal(this.props.navigation, `/actor/detail/${uuid}`);
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

export default connect()((props) => {
  const navigation = useTRPGStackNavigation();

  return <Actor {...props} navigation={navigation} />;
});
