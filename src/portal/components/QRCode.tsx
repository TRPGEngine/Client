import { TMemo } from '@shared/components/TMemo';
import React from 'react';
import ReactQRCode, { BaseQRCodeProps } from 'qrcode.react';

interface Props extends BaseQRCodeProps {}
export const QRCode: React.FC<Props> = TMemo((props) => {
  return (
    <ReactQRCode
      size={128}
      imageSettings={{
        src: '/src/web/assets/img/logo@192.png',
        height: 24,
        width: 24,
        excavate: true,
      }}
      {...props}
    />
  );
});
