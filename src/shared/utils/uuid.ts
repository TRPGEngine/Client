import { anyNonNil, v1, v4 } from 'is-uuid';

export const isUUID = (uuid: string) => {
  return anyNonNil(uuid);
};

export const isUserUUID = (uuid: string) => {
  return v1(uuid);
};
