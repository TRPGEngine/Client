import { useRTCRoomStateSelector } from '@rtc/redux';
import { ProducersStateItem } from '@rtc/redux/types/producers';
import { useMemo } from 'react';

/**
 * 获取所有数据生产设备
 */
export function useRTCProducers(): ProducersStateItem[] {
  const producers = useRTCRoomStateSelector((state) => state.producers);
  const producersArray = useMemo(() => Object.values(producers), [producers]);

  return producersArray;
}

/**
 * 获取音频数据生产设备
 */
export function useRTCAudioProducer(): ProducersStateItem | undefined {
  const producersArray = useRTCProducers();

  const audioProducer = useMemo(() => {
    return producersArray.find((producer) => producer.track.kind === 'audio');
  }, [producersArray]);

  return audioProducer;
}
