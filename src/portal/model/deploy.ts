import { request } from '@portal/utils/request';

type DeployVersionPlatform = 'android' | 'ios' | 'windows' | 'mac' | 'linux';

export interface DeployVersion {
  version: string;
  platform: DeployVersionPlatform;
  download_url: string;
  describe: string;
}

export const fetchLatestVersion = (): Promise<Partial<DeployVersion>> =>
  request.get('/deploy/version/latest').then((res) => res.data.version ?? {});
