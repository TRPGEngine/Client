import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { View } from 'react-native';
import ListCell from '../components/ListCell';
import { List } from '@ant-design/react-native';
import { switchNav } from '../redux/actions/nav';
const Item = List.Item;

interface Props extends DispatchProp {}
interface State {
  test: boolean;
}
class SettingsScreen extends React.Component<Props, State> {
  state = {
    test: false,
  };

  nav = (routeName: string) => {
    this.props.dispatch(switchNav(routeName));
  };

  render() {
    return (
      <View style={styles.container}>
        <ListCell
          title="测试"
          value={this.state.test}
          onChange={(newValue) => this.setState({ test: newValue })}
        />

        <List renderHeader={'basic'}>
          <Item
            disabled
            arrow="horizontal"
            onPress={() => this.nav('SettingsDeviceInfo')}
          >
            设备信息
          </Item>
        </List>
      </View>
    );
  }
}

const styles = {
  container: [{ paddingTop: 10, flex: 1 }],
};

export default connect()(SettingsScreen);
