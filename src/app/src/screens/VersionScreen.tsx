import React from 'react';
import { Text, Linking, Image } from 'react-native';
import config from '@src/shared/project.config';
import { WingBlank } from '@ant-design/react-native';
import { TButton } from '../components/TComponent';
import styled from 'styled-components/native';
import appConfig from '../config.app';
import { connect, DispatchProp } from 'react-redux';
import checkVersion, { getLastVersion } from '@src/shared/utils/check-version';
import { showToast } from '@src/shared/redux/actions/ui';
import CodePush, { LocalPackage } from 'react-native-code-push';
import rnStorage from '@src/shared/api/rn-storage.api';

// 版本信息页面
const VersionContainer = styled(WingBlank).attrs((props) => ({ size: 'md' }))`
  padding: 10px 0;
  flex: 1;
`;

const VersionInfo = styled.View`
  flex: 1;
  overflow: hidden;
`;

const LogoImg = styled.Image.attrs((props) => ({
  source: appConfig.defaultImg.logo,
}))`
  border-radius: 10px;
  width: 72px;
  height: 72px;
  margin: 20px auto;
`;

interface Props extends DispatchProp<any> {}
class VersionScreen extends React.Component<Props> {
  state = {
    lastVersion: '正在获取...',
    stateText: '',
    progressText: '',
    codepushMeta: {} as LocalPackage,
    isAlphaUser: false,
  };

  componentDidMount() {
    getLastVersion().then((version) => this.setState({ lastVersion: version }));

    CodePush.getUpdateMetadata().then((pkg) =>
      this.setState({ codepushMeta: pkg })
    );

    rnStorage
      .get('isAlphaUser', false)
      .then((isAlphaUser) => this.setState({ isAlphaUser }));
  }

  setText(text: string) {
    this.setState({ stateText: text });
  }

  handleCheckVersion = () => {
    const dispatch = this.props.dispatch;
    if (appConfig.codePush.enabled) {
      // TODO: 也许需要根据版本判断用户是否应为热更新还是下载apk更新
      appConfig.codePush.sync({
        onStatueChanged: (status: CodePush.SyncStatus) => {
          if (status === CodePush.SyncStatus.UP_TO_DATE) {
            this.setText('当前版本已为最新版');
          }

          if (status === CodePush.SyncStatus.UPDATE_INSTALLED) {
            this.setText('下载完毕, 重启后生效');
          }

          if (status === CodePush.SyncStatus.UPDATE_IGNORED) {
            this.setText('更新被忽略');
          }

          if (status === CodePush.SyncStatus.UNKNOWN_ERROR) {
            this.setText('发生未知错误');
          }

          if (status === CodePush.SyncStatus.SYNC_IN_PROGRESS) {
            this.setText('正在更新...');
          }

          if (status === CodePush.SyncStatus.CHECKING_FOR_UPDATE) {
            this.setText('检查更新中...');
          }

          if (status === CodePush.SyncStatus.AWAITING_USER_ACTION) {
            this.setText('等待用户确认');
          }

          if (status === CodePush.SyncStatus.DOWNLOADING_PACKAGE) {
            this.setText('下载数据包中...');
          }

          if (status === CodePush.SyncStatus.INSTALLING_UPDATE) {
            this.setText('正在安装更新');
          }
        },
        onDownloadProgressChanged: (progress) => {
          this.setState({
            progressText: `${progress.receivedBytes}/${progress.totalBytes}`,
          });
        },
      });
    } else {
      checkVersion(function(isLatest) {
        if (isLatest) {
          dispatch(showToast('当前版本为最新版'));
        } else {
          dispatch(showToast('检测到有新的版本, 1秒后自动跳转到项目主页'));
          setTimeout(function() {
            Linking.openURL(config.github.projectUrl);
          }, 1000);
        }
      });
    }
  };

  render() {
    return (
      <VersionContainer>
        <VersionInfo>
          <LogoImg />
          {this.state.isAlphaUser && <Text>内测用户</Text>}
          <Text>当前版本: {config.version}</Text>
          <Text>最新版本: {this.state.lastVersion}</Text>
          <Text>当前版本标签: {this.state.codepushMeta.label}</Text>
          <Text>当前版本Hash: {this.state.codepushMeta.packageHash}</Text>
          <Text>当前版本描述:</Text>
          <Text>{this.state.codepushMeta.description}</Text>

          <Text>{this.state.stateText}</Text>
          {this.state.progressText !== '' && (
            <Text>下载进度: {this.state.progressText}</Text>
          )}
        </VersionInfo>
        <TButton onPress={this.handleCheckVersion}>检查版本更新</TButton>
      </VersionContainer>
    );
  }
}

export default connect()(VersionScreen);
