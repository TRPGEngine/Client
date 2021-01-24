import { request } from '@shared/utils/request';

interface OAuthAppPublicInfo {
  appid: string;
  name: string;
  icon?: string;
  website?: string;
}

/**
 * 获取OAuth应用信息
 * @param appid OAuth应用id
 */
export async function fetchOAuthAppInfo(
  appid: string
): Promise<OAuthAppPublicInfo | null> {
  const { data } = await request.get(`/oauth/app/${appid}/info`);

  return data.appInfo;
}

/**
 * 授权app并获取到一个code
 */
export async function authorizeApp(
  appid: string,
  scope: string[]
): Promise<string> {
  const { data } = await request.post(`/oauth/app/${appid}/authorize`, {
    scope,
  });

  return data.code;
}
