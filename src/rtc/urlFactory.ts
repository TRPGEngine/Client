import config from '@shared/project.config';

export function getProtooUrl({ roomId, peerId, forceH264, forceVP9 }) {
  let url = `${config.url.rtc}/?roomId=${roomId}&peerId=${peerId}`;

  if (forceH264) url = `${url}&forceH264=true`;
  else if (forceVP9) url = `${url}&forceVP9=true`;

  return url;
}
