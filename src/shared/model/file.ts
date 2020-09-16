import memoizeOne from 'memoize-one';
import { request } from '@shared/utils/request';

export interface DocumentListType {
  uuid: string;
  name: string;
  views: string;
}
/**
 * 获取文档列表
 */
export const fetchDocumentList = memoizeOne(async () => {
  const { data } = await request.get<{
    list: DocumentListType[];
  }>('/file/document/list');

  return data.list;
});

/**
 * 获取文档URL
 */
export const fetchDocumentLink = memoizeOne(
  async (uuid: string): Promise<string> => {
    const { data } = await request.get(`/file/document/view/${uuid}`);
    return data.link;
  }
);

/**
 * 绑定文件头像UUID
 * @param avatarUUID 头像UUID
 * @param attachUUID 关联UUID
 */
export const bindFileAvatarAttachUUID = async (
  avatarUUID: string,
  attachUUID: string
) => {
  const fileAvatar = await request.post('/file/avatar/bindAttachUUID', {
    avatarUUID,
    attachUUID,
  });

  return fileAvatar;
};
