import CodePush, {
  SyncStatusChangedCallback,
  DownloadProgressCallback,
  HandleBinaryVersionMismatchCallback,
  CodePushOptions,
} from 'react-native-code-push';
import _invoke from 'lodash/invoke';
import Config from 'react-native-config';
import rnStorage from '@src/shared/api/rn-storage.api';

/**
 * 获取codepush的部署key
 * 如果为内测用户则返回Staging的key
 */
const getCodepushDeploymentKey = async (): Promise<string> => {
  const isAlphaUser = await rnStorage.get('isAlphaUser', false);

  return isAlphaUser
    ? Config.CODEPUSH_DEPLOYMENTKEYSTAGING
    : Config.CODEPUSH_DEPLOYMENTKEY;
};

const out = {
  defaultImg: {
    logo: require('./assets/img/trpg_logo.png'),
    user: '', // 让系统系统生成
    group: require('./assets/img/gugugu1.png'),
    trpgsystem: require('./assets/img/system_notice.png'),
    actor: null,
    file: {
      default: require('./assets/img/file/default.png'),
      pdf: require('./assets/img/file/pdf.png'),
      excel: require('./assets/img/file/excel.png'),
      ppt: require('./assets/img/file/ppt.png'),
      word: require('./assets/img/file/word.png'),
      txt: require('./assets/img/file/txt.png'),
      pic: require('./assets/img/file/pic.png'),
    },
  },
  file: {
    getFileImage: function(ext) {
      if (ext === 'jpg' || ext === 'png' || ext === 'gif') {
        return out.defaultImg.file.pic;
      }
      if (ext === 'doc' || ext === 'docx') {
        return out.defaultImg.file.word;
      }
      if (ext === 'xls' || ext === 'xlsx') {
        return out.defaultImg.file.excel;
      }
      if (ext === 'ppt' || ext === 'pptx') {
        return out.defaultImg.file.ppt;
      }
      if (ext === 'pdf') {
        return out.defaultImg.file.pdf;
      }
      if (ext === 'txt') {
        return out.defaultImg.file.txt;
      }

      return out.defaultImg.file.default;
    },
  },
  codePush: {
    enabled: true,
    options: {
      checkFrequency: CodePush.CheckFrequency.MANUAL, // 手动更新
    } as CodePushOptions,
    async sync(cb?: {
      onStatueChanged?: SyncStatusChangedCallback;
      onDownloadProgressChanged?: DownloadProgressCallback;
      onHandleBinaryVersionMismatchCallback?: HandleBinaryVersionMismatchCallback;
    }) {
      return CodePush.sync(
        {
          updateDialog: {
            appendReleaseDescription: true,
            descriptionPrefix: '\n\n更新内容：\n',
            title: '更新',
            optionalInstallButtonLabel: '更新',
            optionalIgnoreButtonLabel: '忽略',
            optionalUpdateMessage: '有新的版本可以使用，是否更新?',
            mandatoryUpdateMessage: '有新的版本必须更新',
            mandatoryContinueButtonLabel: '更新',
          },
          installMode: CodePush.InstallMode.IMMEDIATE,
          deploymentKey: await getCodepushDeploymentKey(),
        },
        (status) => {
          console.log('[code push status]', status);
          _invoke(cb, 'onStatueChanged', status);
        },
        (progress) => {
          console.log(
            '[code push process]',
            progress.receivedBytes / progress.totalBytes
          );
          _invoke(cb, 'onDownloadProgressChanged', progress);
        },
        (update) => {
          console.log('[code push update]', update);
          _invoke(cb, 'onHandleBinaryVersionMismatchCallback', update);
        }
      );
    },
  },
  oauth: {
    qq: {
      icon: require('./assets/img/oauth/qqconnect.png'),
    },
  },
};

const appConfig = out;
export default appConfig;
