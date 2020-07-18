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
  if (typeof path === 'string' && path.startsWith('/src/')) {
    // 不处理client的内部路径的头像
    return path;
  }

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
  if (config.isSSL && url.startsWith('http://')) {
    // 如果当前是ssl协议且下载地址是http协议
    // 直接打开窗口(因为mix-content限制)
    window.open(url);
    return;
  }

  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = url;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
