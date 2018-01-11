const React = require('react');
const { connect } = require('react-redux');
const {
  View,
  Text,
  ListView,
} = require('react-native');
const sb = require('react-native-style-block');
const ConvItem = require('../components/ConvItem');

class HomeScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'TRPG',
    tabBarIcon: ({ tintColor }) => (
      <Text style={{fontFamily:'iconfont', fontSize: 26, color: tintColor}}>&#xe648;</Text>
    ),
  };

  render() {
    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    let items = ds.cloneWithRows(Array.from({length:100}));

    return (
      <View>
        <ListView
          style={styles.convList}
          dataSource={items}
          renderRow={(rowData) => (
            <ConvItem />
          )}
        />
      </View>
    )
  }
}

const styles = {
  convList: [
    sb.bgColor(),
    // sb.size('100%', 400),
  ]
}

module.exports = connect()(HomeScreen);
