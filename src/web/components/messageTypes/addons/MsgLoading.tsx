import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import { useDelayLoading } from '@shared/hooks/useDelay';
import { LoadingSpinnerSmall } from '@web/components/LoadingSpinnerSmall';

/**
 * 渲染消息loading
 */
interface Props {
  loading: boolean;
}
export const MessageLoading: React.FC<Props> = TMemo((props) => {
  const isLoading = useDelayLoading(props.loading);

  return isLoading ? <LoadingSpinnerSmall /> : null;
});
MessageLoading.displayName = 'MessageLoading';
