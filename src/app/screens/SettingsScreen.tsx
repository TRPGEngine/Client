import React from 'react';
import { connect } from 'react-redux';
const { View, Text, CheckBox, Switch, Picker } = require('react-native');
import ListCell from '../components/ListCell';
import sb from 'react-native-style-block';

class SettingsScreen extends React.Component<{}, { test: boolean }> {
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
          onChange={(newValue) => this.setState({ test: newValue })}
        />
      </View>
    );
  }
}

const styles = {
  container: [{ paddingTop: 10, flex: 1 }],
};

export default SettingsScreen;
