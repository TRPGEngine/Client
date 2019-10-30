import memoizeOne from 'memoize-one';
import request from '@shared/utils/request';

export interface DocumentListType {
  uuid: string;
  name: string;
  views: string;
}
/**
 * 获取文档列表
 */
export const fetchDocumentList = memoizeOne(async () => {
  const { data } = await request<{
    list: DocumentListType[];
  }>('/file/document/list');
  return data.list;
});

/**
 * 获取文档URL
 */
export const fetchDocumentLink = memoizeOne(
  async (uuid: string): Promise<string> => {
    const { data } = await request(`/file/document/view/${uuid}`);
    return data.link;
  }
);
