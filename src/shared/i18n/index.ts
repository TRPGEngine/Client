import i18next, { TFunction } from 'i18next';
import { crc32 } from 'crc';
import { resources } from './resources';
import { languageDetector } from './language';

i18next.use(languageDetector).init({
  debug: true,
  fallbackLng: 'zh-CN',
  resources,
});

/**
 * 国际化翻译
 */
export const t: TFunction = (key, defaultValue?, options?) => {
  const hashKey = `k${crc32(key).toString(16)}`;
  let words = i18next.t(hashKey);
  if (words === hashKey) {
    words = key;
    console.warn(`翻译缺失: [${hashKey}]${key}`);
  }
  return words;
};
