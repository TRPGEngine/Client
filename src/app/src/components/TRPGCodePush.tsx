import React from 'react';
import appConfig from '@app/config.app';
import CodePush, { SyncOptions } from 'react-native-code-push';
import { AppState } from 'react-native';

const options: SyncOptions = {
  updateDialog: null, // 不显示对话框直接更新
  installMode: CodePush.InstallMode.ON_NEXT_RESUME,
};

/**
 * 自封装的CodePush静默更新组件
 */
export default class TRPGCodePush extends React.Component {
  componentDidMount() {
    appConfig.codePush.sync(options);

    if (
      appConfig.codePush.options.checkFrequency ===
      CodePush.CheckFrequency.ON_APP_RESUME
    ) {
      // 当检查设置为每次唤醒时
      AppState.addEventListener('change', (newState) => {
        newState === 'active' && appConfig.codePush.sync(options);
      });
    }
  }

  render() {
    return this.props.children;
  }
}
