import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { View, Switch } from 'react-native';
import { List } from '@ant-design/react-native';
import { switchNav } from '../redux/actions/nav';
import rnStorage from '@src/shared/api/rn-storage.api';
const Item = List.Item;

interface Props extends DispatchProp {}
interface State {
  isAlphaUser: boolean;
}
class SettingsScreen extends React.Component<Props, State> {
  state = {
    isAlphaUser: false,
  };

  async componentDidMount() {
    const isAlphaUser = await rnStorage.get('isAlphaUser', false);
    this.setState({ isAlphaUser });
  }

  nav = (routeName: string) => {
    this.props.dispatch(switchNav(routeName));
  };

  onChangeIsAlphaUser = async (val: boolean) => {
    await rnStorage.set('isAlphaUser', val);
    this.setState({ isAlphaUser: val });
  };

  render() {
    const { isAlphaUser } = this.state;

    return (
      <View>
        <List renderHeader="基本设置">
          <Item
            arrow="horizontal"
            onPress={() => this.nav('SettingsDeviceInfo')}
          >
            设备信息
          </Item>
          <Item
            extra={
              <Switch
                value={isAlphaUser}
                onValueChange={this.onChangeIsAlphaUser}
              />
            }
          >
            我要成为内测用户
          </Item>
        </List>
      </View>
    );
  }
}

export default connect()(SettingsScreen);
