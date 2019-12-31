import config from '../project.config';
import _isString from 'lodash/isString';

export const getOriginalImage = (thumbnailImageUrl: string): string => {
  if (_isString(thumbnailImageUrl)) {
    return thumbnailImageUrl.replace('/thumbnail', '');
  } else {
    return thumbnailImageUrl;
  }
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

/**
 * 网页端下载文件
 * @param url 下载地址
 */
export const downloadFileWeb = (url: string) => {
  let a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = url;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
