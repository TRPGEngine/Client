import React, { useState, useEffect } from 'react';
import { TMemo } from '@shared/components/TMemo';
import { useTRPGSelector } from '@shared/hooks/useTRPGSelector';
import { FullScreenLoading } from './FullScreenLoading';
import { useDebounce } from 'react-use';

/**
 * 超过5s后仍无法连接则显示loading
 * 如果连接正常立即消失
 */
function useShowLoading(isOnline: boolean) {
  const [showLoading, setShowLoading] = useState(false);

  useDebounce(
    () => {
      if (isOnline === false) {
        setShowLoading(true);
      }
    },
    5000,
    [isOnline]
  );

  useEffect(() => {
    if (isOnline === true) {
      setShowLoading(false);
    }
  }, [isOnline]);

  return showLoading;
}

/**
 * 当出现长时间的网络异常时
 * 弹出全屏模态框以阻止用户在断网情况下进行一些操作
 */
export const NetworkStatusModal: React.FC = TMemo(() => {
  const network = useTRPGSelector((state) => state.ui.network);
  const isOnline = network.isOnline;
  const showLoading = useShowLoading(isOnline);

  return showLoading ? (
    <FullScreenLoading text={`网络断开: ${network.msg}`} />
  ) : null;
});
NetworkStatusModal.displayName = 'NetworkStatusModal';
