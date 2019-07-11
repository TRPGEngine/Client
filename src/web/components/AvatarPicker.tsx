import React, { useState, useRef } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import { Modal, Avatar } from 'antd';
import 'react-image-crop/dist/ReactCrop.css';

let fileUrlTemp: string = null; // 缓存裁剪后的图片url

/**
 * 根据裁剪信息裁剪原始图片
 * 生成一个临时的资源文件路径
 * @param image 原始图片元素
 * @param crop 裁剪信息
 * @param fileName 文件名
 */
function getCroppedImg(image: HTMLImageElement, crop: Crop, fileName: string) {
  const canvas = document.createElement('canvas');
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext('2d');

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  );

  return new Promise<string>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        // reject(new Error('Canvas is empty'));
        console.error('Canvas is empty');
        return;
      }
      (blob as any).name = fileName;
      window.URL.revokeObjectURL(fileUrlTemp);
      fileUrlTemp = window.URL.createObjectURL(blob);
      resolve(fileUrlTemp);
    }, 'image/jpeg');
  });
}

interface Props {
  imageUrl?: string;
  onChange?: (imageUrl: string) => void;
}
/**
 * 头像选择器
 */
const AvatarPicker = (props: Props) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false); // 是否显示模态框
  const [originImageUrl, setOriginImageUrl] = useState<string>(''); // 原始图片的url
  const [cropUrl, setCropUrl] = useState<string>(props.imageUrl || ''); // 裁剪后并使用的url
  const fileRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setModalVisible(true);

    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () =>
        setOriginImageUrl(reader.result.toString())
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const makeClientCrop = async (crop: Crop) => {
    if (imageRef && crop.width && crop.height) {
      const croppedImageUrl = await getCroppedImg(
        imageRef.current,
        crop,
        'newFile.jpeg'
      );
      setCropUrl(croppedImageUrl);
      props.onChange && props.onChange(croppedImageUrl); // 向父级发送回调

      // 完成后清理UI
      setModalVisible(false);
      fileRef.current.value = '';
    }
  };

  const [cropInfo, setCropInfo] = useState<Crop>({
    unit: '%',
    width: 30,
    aspect: 1,
  });
  return (
    <div>
      <div
        style={{ cursor: 'pointer', display: 'inline-block' }}
        onClick={() => fileRef.current.click()}
      >
        <input
          ref={fileRef}
          type="file"
          style={{ display: 'none' }}
          onChange={handleSelectFile}
        />
        <Avatar size={64} icon="user" src={cropUrl} />
      </div>
      <Modal
        width={800}
        visible={modalVisible}
        closable={false}
        onCancel={() => setModalVisible(false)}
        onOk={() => makeClientCrop(cropInfo)}
      >
        <div style={{ overflow: 'hidden' }}>
          {originImageUrl !== '' && (
            <ReactCrop
              src={originImageUrl}
              crop={cropInfo}
              onImageLoaded={(ref) => (imageRef.current = ref)}
              onChange={(crop) => setCropInfo(crop)}
            />
          )}
        </div>
      </Modal>
    </div>
  );
};

export default AvatarPicker;
