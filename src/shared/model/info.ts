import { buildCacheFactory, CachePolicy } from '@shared/utils/cache-factory';
import { request } from '@shared/utils/request';
import { isUrl } from '@shared/utils/string-helper';

export interface WebsiteInfo {
  title: string;
  content: string;
  icon?: string;
}

/**
 * 获取网页缩略信息
 */
export const fetchWebsiteInfo = buildCacheFactory<WebsiteInfo>(
  CachePolicy.Temporary,
  async (messageUrl: string) => {
    if (!isUrl(messageUrl)) {
      throw new Error('不是一个合法的Url:' + messageUrl);
    }

    const { data } = await request.get(`/info/website/info?url=${messageUrl}`);

    return data.info;
  }
);
