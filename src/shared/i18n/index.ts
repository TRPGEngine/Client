import i18next, { TFunction } from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { crc32 } from 'crc';
const resBundle = require('i18next-resource-store-loader!./langs/index.js');

i18next.use(LanguageDetector).init({
  debug: true,
  fallbackLng: 'zh-CN',
  resources: resBundle,
});

/**
 * 国际化翻译
 */
export const t: TFunction = (key, defaultValue?, options?) => {
  const hashKey = `k${crc32(key).toString(16)}`;
  let words = i18next.t(hashKey);
  if (words === hashKey) {
    words = key;
    console.log(`翻译缺失: [${hashKey}]${key}`);
  }
  return words;
};
