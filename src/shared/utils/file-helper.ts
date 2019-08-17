import config from '../../../config/project.config';

export const getOriginalImage = (thumbnailImageUrl: string) => {
  return thumbnailImageUrl.replace('/thumbnail', '');
};

/**
 * 获取基于API的绝对路径
 * @param path 地址路径
 */
export const getAbsolutePath = (path: string) => {
  return config.file.getAbsolutePath(path);
};

/**
 * 获取基于APi的相对路径
 * @param path 地址路径
 */
export const getRelativePath = (path: string) => {
  return config.file.getRelativePath(path);
};

/**
 * 获取上传图片的地址
 * @param filename 文件名
 * @param isTemporary 是否为临时文件
 */
export const getUploadsImagePath = (filename: string, isTemporary = false) => {
  return config.file.getUploadsImagePath(filename, isTemporary);
};
