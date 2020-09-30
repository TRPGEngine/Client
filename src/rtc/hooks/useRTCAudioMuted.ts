import { useRTCRoomStateSelector } from '@rtc/redux';

export function useRTCAudioMuted() {
  const audioMuted = useRTCRoomStateSelector((state) => state.me.audioMuted);

  return audioMuted;
}
