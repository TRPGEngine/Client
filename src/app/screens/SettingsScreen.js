const React = require('react');
const { connect } = require('react-redux');
const {
  View,
  Text,
  CheckBox,
  Switch,
  Picker,
  Slider,
} = require('react-native');
const ListCell = require('../components/ListCell');
const sb = require('react-native-style-block');

class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      test: false,
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <ListCell
          title="测试"
          value={this.state.test}
          onChange={(newValue) => this.setState({test: newValue})}
        />
      </View>
    )
  }
}

const styles = {
  container: [
    {paddingTop: 10, flex: 1},
  ]
}

module.exports = connect()(SettingsScreen);
