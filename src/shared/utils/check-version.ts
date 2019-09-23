import axios from 'axios';
import config from '../project.config';
import _get from 'lodash/get';
import _isNil from 'lodash/isNil';
import request from './request';

export interface VersionInfo {
  version: string;
  platform: string;
  download_url: string;
  describe?: string;
  createdAt: string;
}

/**
 * 从github上获取最新一条的版本记录
 */
export function getLastVersion(): Promise<string> {
  return axios
    .get(config.github.projectPackageUrl)
    .then((resp) => _get(resp.data, 'version', ''))
    .catch(function(err) {
      console.log('网络错误\n' + err);
    });
}

/**
 * 获取服务端提供的最新一条的版本信息
 */
export function getLastDeployVersion(): Promise<VersionInfo> {
  return request<{
    version: VersionInfo;
  }>('/deploy/version/latest', 'get', { platform: 'android' }).then(
    ({ data }) => {
      return data.version;
    }
  );
}

function checkVersion(cb: (isLatest: boolean) => void) {
  console.log('正在检查版本...');

  getLastVersion().then((version) => cb(version === config.version));
}

export default checkVersion;
