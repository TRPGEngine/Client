import { TMemo } from '@capital/shared/components/TMemo';
import { QRCode } from '@capital/web/components/QRCode';
import {
  checkLoginQRCodeStatus,
  fetchUserLoginStatus,
  generateLoginQRCodeUrl,
} from '../model/netease-music';
import { useCallback, useEffect, useRef, useState } from 'react';
import { showToasts } from '@capital/shared/manager/ui';
import React from 'react';
import { LoadingSpinner } from '@capital/web/components/LoadingSpinner';
import { Button, Typography } from 'antd';
import { t } from '@capital/shared/i18n';
import { useValueRef } from '@capital/shared/hooks/useValueRef';

const qrStatusMap = {
  800: 'expired' as const,
  801: 'init' as const,
  802: 'pending' as const,
  803: 'success' as const,
};
const qrStatusType = Object.values(qrStatusMap);

type QRStatusCode = keyof typeof qrStatusMap;
type QRStatusType = typeof qrStatusType[number] | 'unknown';

interface Props {
  onAuthorization?: () => void;
}
export const NeteaseMusicQRCodeLogin: React.FC<Props> = TMemo((props) => {
  const { onAuthorization } = props;
  const [qrurl, setQRurl] = useState<string | undefined>();
  const [qrStatus, setQRStatus] = useState<QRStatusType>('unknown');
  const [qrStatusMessage, setQRStatusMessage] = useState('');
  const unikeyRef = useRef('');

  const generateLoginQRCode = useCallback(() => {
    generateLoginQRCodeUrl()
      .then(({ unikey, qrurl }) => {
        setQRurl(qrurl);
        unikeyRef.current = unikey;
      })
      .catch((err) => showToasts(String(err), 'error'));
  }, []);

  useEffect(() => {
    generateLoginQRCode();
  }, []);

  const onAuthorizationRef = useValueRef(onAuthorization);

  useEffect(() => {
    // 当qrurl发生一次变化时，进行监听轮询
    if (typeof qrurl !== 'string') {
      return;
    }

    if (typeof unikeyRef.current !== 'string') {
      return;
    }

    let timer: ReturnType<typeof setTimeout>;
    function loop() {
      timer = setTimeout(() => {
        checkLoginQRCodeStatus(unikeyRef.current).then(({ code, message }) => {
          setQRStatus(qrStatusMap[code as QRStatusCode] ?? 'unknown');
          setQRStatusMessage(message);

          if (code === 803) {
            setQRStatus('success');
            console.log('登录成功');
            if (typeof onAuthorizationRef.current === 'function') {
              onAuthorizationRef.current();
            }
          } else if (code === 800) {
            // 二维码失效。 不再次检查
          } else {
            loop();
          }
        });
      }, 1500);
    }
    loop(); // start

    return () => {
      clearTimeout(timer);
    };
  }, [qrurl]);

  if (typeof qrurl === 'string') {
    return (
      <div style={{ textAlign: 'center' }}>
        <Typography.Title level={4}>{t('扫码登录网易云音乐')}</Typography.Title>
        <QRCode
          includeMargin={true}
          value={qrurl}
          size={256}
          imageSettings={{ height: 48, width: 48, excavate: false }}
        />
        {qrStatus !== 'init' && <p>{qrStatusMessage}</p>}
        {qrStatus === 'expired' && (
          <Button type="link" onClick={generateLoginQRCode}>
            {t('刷新')}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div>
      <LoadingSpinner />
    </div>
  );
});
NeteaseMusicQRCodeLogin.displayName = 'NeteaseMusicQRCodeLogin';
