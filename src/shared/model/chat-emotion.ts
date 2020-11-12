import memoizeOne from 'memoize-one';
import { request } from '@shared/utils/request';
import _isString from 'lodash/isString';

export interface ChatEmotionItem {
  name?: string;
  url: string;
}

/**
 * 搜索表情包
 */
export const searchEmotionWithKeyword = memoizeOne(async (keyword: string) => {
  if (!_isString(keyword) || keyword === '') {
    return [];
  }

  const { data } = await request.get<{
    list: ChatEmotionItem[];
  }>('/chatemotion/search', { params: { keyword } });

  return data.list;
});
