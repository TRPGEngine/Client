import { request } from '@portal/utils/request';

/**
 *
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
