import { useRTCRoomStateSelector } from '@rtc/redux';

export function useRTCGlobalAudioMuted() {
  const globalAudioMuted = useRTCRoomStateSelector(
    (state) => state.me.audioMuted
  );

  return globalAudioMuted;
}
