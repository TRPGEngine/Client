/**
 * 获取url的query数据
 * @param key 字符串
 */
export function getUrlQuerySeach(key: string): string | null {
  const searchQuery = location.search;
  const params = new URLSearchParams(searchQuery);

  return params.get(key);
}
