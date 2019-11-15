import { blobFromUrl, blobToFile } from '@web/utils/file-helper';
import {
  toAvatar,
  UploadOption,
  AvatarUpdateData,
} from '@shared/utils/upload-helper';

/**
 * 基于BlobUrl上传头像
 * @param userUUID 用户UUID
 * @param blobUrl blobUrl
 * @param options 其他选项
 */
export const toAvatarWithBlobUrl = async function(
  userUUID: string,
  blobUrl: string,
  options: UploadOption = {}
): Promise<AvatarUpdateData> {
  const blob = await blobFromUrl(blobUrl);
  const file = blobToFile(blob, 'avatar.jpg');
  const avatarRet = await toAvatar(userUUID, file, options);

  return avatarRet;
};
