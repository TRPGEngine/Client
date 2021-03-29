/**
 * 生成更短的路径
 *
 * 根据地址规则尝试移除http标准协议的端口
 */
export function generateShorterUrl(urlObj: {
  protocol: 'http' | 'https';
  host: string;
  port: string;
}) {
  if (urlObj.protocol === 'http' && urlObj.port === '80') {
    return `${urlObj.protocol}://${urlObj.host}`;
  } else if (urlObj.protocol === 'https' && urlObj.port === '443') {
    return `${urlObj.protocol}://${urlObj.host}`;
  }

  return `${urlObj.protocol}://${urlObj.host}:${urlObj.port}`;
}
