import axios from 'axios';
import config from '../../../config/project.config';
import _get from 'lodash/get';

export function getLastVersion(): Promise<string> {
  return axios
    .get(config.github.projectPackageUrl)
    .then((resp) => _get(resp.data, 'version', ''))
    .catch(function(err) {
      console.log('网络错误\n' + err);
    });
}

function checkVersion(cb: (isLatest: boolean) => void) {
  console.log('正在检查版本...');

  getLastVersion().then((version) => cb(version === config.version));
}

export default checkVersion;
