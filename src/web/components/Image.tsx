import React, { useEffect, useState } from 'react';
import config from '@shared/project.config';
import Spin from './Spin';
import { TMemo } from '@shared/components/TMemo';

interface Props
  extends React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > {
  src: string;
}

const Image: React.FC<Props> = TMemo((props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [src, setSrc] = useState(props.src);

  useEffect(() => {
    let mImg: HTMLImageElement | null = new window.Image();

    setIsLoading(true);
    mImg.src = props.src;
    mImg.onload = () => {
      setIsLoading(false);
      mImg = null; // 释放内存
    };
    mImg.onerror = () => {
      setIsLoading(false);
      mImg = null; // 释放内存
    };
  }, [props.src]);

  useEffect(() => {
    setSrc(props.src);
  }, [props.src]);

  if (isLoading) {
    return <Spin />;
  }

  return (
    <img
      {...props}
      src={src}
      onError={() => {
        setSrc(config.defaultImg.chatimg_fail);
      }}
    />
  );
});
Image.displayName = 'Image';

export default Image;
