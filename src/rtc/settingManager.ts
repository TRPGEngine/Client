import rnStorage from '@shared/api/rn-storage.api';

const USER_KEY = 'rtc:user';
const DEVICES_KEY = 'rtc:devices';

interface UserSetting {
  displayName: string;
}
interface DevicesSetting {
  webcamEnabled: boolean;
}

export function getUser(): Promise<UserSetting> {
  return rnStorage.get(USER_KEY);
}

export async function setUser({ displayName }: UserSetting): Promise<void> {
  await rnStorage.set(USER_KEY, { displayName });
}

export function getDevices(): Promise<DevicesSetting> {
  return rnStorage.get(DEVICES_KEY);
}

export async function setDevices({
  webcamEnabled,
}: DevicesSetting): Promise<void> {
  await rnStorage.set(DEVICES_KEY, { webcamEnabled });
}
