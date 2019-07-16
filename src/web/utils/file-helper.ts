/**
 * 传入一个图片文件， 返回对应的 Base64 编码
 * @param img 图片文件
 */
export function fileToDataUrl(img: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(reader.result.toString()));
    reader.addEventListener('error', () => reject(reader.error));
    reader.readAsDataURL(img);
  });
}

/**
 * 根据一个BlobUrl地址获取相应的Blob对象
 * @param blobUrl blobUrl 地址，由URL.createObjectURL方法生成
 */
export function blobFromUrl(blobUrl: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest();
    req.responseType = 'blob';
    req.onload = () => {
      resolve(req.response);
    };
    req.onerror = () => {
      reject(req.responseText);
    };
    req.open('get', blobUrl);
    req.send();
  });
}

/**
 * Blob对象转文件对象
 * @param blob Blob对象
 * @param fileName 文件名
 */
export function blobToFile(blob: Blob, fileName: string): File {
  return new File([blob], fileName, {
    lastModified: new Date().valueOf(),
    type: blob.type,
  });
}
