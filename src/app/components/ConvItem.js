const React = require('react');
const {
  Platform,
  Text,
  View,
  Image,
} = require('react-native');
const sb = require('react-native-style-block');

class ConvItem extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.avatar} source={{uri: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1881776517,987084327&fm=27&gp=0.jpg'}} />
        <View style={styles.body}>
          <View style={styles.title}>
            <Text style={styles.name}>人名{Math.random()}</Text>
            <Text style={styles.time}>2天前</Text>
          </View>
          <Text style={styles.msg}>最近消息</Text>
        </View>
      </View>
    )
  }
}

const styles = {
  container: [
    sb.border('Bottom', 0.5, '#ccc', 'solid'),
    sb.direction('row'),
    sb.padding(6),
  ],
  avatar: [
    sb.size(40, 40),
    sb.radius(20),
  ],
  body: [
    sb.flex(),
    sb.padding(0, 4),
  ],
  title: [
    sb.direction('row'),
    // sb.flex(1),
  ],
  name: [
    sb.flex(),
  ],
  time: [
    sb.color('#BDBEBF'),
  ],
  msg: [
    sb.flex(),
    sb.textAlign('left'),
    {paddingTop: 6},
    sb.color('#BDBEBF'),
    sb.font(12),
  ]
}

module.exports = ConvItem;
