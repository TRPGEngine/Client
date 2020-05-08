import React from 'react';
import { connect } from 'react-redux';
import { View, Switch } from 'react-native';
import { List } from '@ant-design/react-native';
import { switchNav } from '../redux/actions/nav';
import rnStorage from '@src/shared/api/rn-storage.api';
import config, { DefaultSettings } from '@src/shared/project.config';
import { setSystemSettings } from '@redux/actions/settings';
import { TRPGDispatchProp, TRPGState } from '@redux/types/__all__';
const Item = List.Item;

interface Props extends TRPGDispatchProp {
  systemSettings: DefaultSettings['system'];
}
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

  handleChangeIsAlphaUser = async (checked: boolean) => {
    await rnStorage.save('isAlphaUser', checked);
    this.setState({ isAlphaUser: checked });
  };

  handleSetDisableSendWritingState = (checked: boolean) => {
    this.props.dispatch(
      setSystemSettings({ disableSendWritingState: checked })
    );
  };

  render() {
    const { isAlphaUser } = this.state;
    const { systemSettings } = this.props;

    return (
      <View>
        <List renderHeader="基本设置">
          <Item
            arrow="horizontal"
            onPress={() => this.nav('SettingsDeviceInfo')}
          >
            设备信息
          </Item>
          {config.environment === 'development' ? (
            <Item
              arrow="horizontal"
              onPress={() => this.nav('SettingsDevelopLab')}
            >
              开发实验室
            </Item>
          ) : null}
          <Item
            extra={
              <Switch
                value={systemSettings.disableSendWritingState}
                onValueChange={this.handleSetDisableSendWritingState}
              />
            }
          >
            不发送输入状态
          </Item>
          <Item
            extra={
              <Switch
                value={isAlphaUser}
                onValueChange={this.handleChangeIsAlphaUser}
              />
            }
          >
            我要成为内测用户
          </Item>
          {isAlphaUser ? (
            <Item arrow="horizontal" onPress={() => this.nav('Debug')}>
              调试面板
            </Item>
          ) : null}
        </List>
      </View>
    );
  }
}

export default connect((state: TRPGState) => ({
  systemSettings: state.settings.system,
}))(SettingsScreen);
