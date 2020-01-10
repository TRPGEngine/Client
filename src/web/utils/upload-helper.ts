import { blobFromUrl, blobToFile } from '@web/utils/file-helper';
import {
  toAvatar,
  UploadOption,
  AvatarUpdateData,
  toGroupAvatar,
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
  // TODO: 上传前需要先检查是否存在
  const blob = await blobFromUrl(blobUrl);
  const file = blobToFile(blob, 'avatar.jpg');
  const avatarRet = await toAvatar(userUUID, file, options);

  return avatarRet;
};

/**
 * 基于BlobUrl上传头像
 * 类似于toAvatarWithBlobUrl但是是文件类型为groupActor
 */
export const toGroupActorWithBlobUrl = async function(
  userUUID: string,
  blobUrl: string,
  options: UploadOption = {}
): Promise<AvatarUpdateData> {
  const blob = await blobFromUrl(blobUrl);
  const file = blobToFile(blob, 'avatar.jpg');
  const avatarRet = await toGroupAvatar(userUUID, file, options);

  return avatarRet;
};
