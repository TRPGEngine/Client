import i18next, { TFunction } from 'i18next';
import {
  useTranslation as useI18NTranslation,
  initReactI18next,
} from 'react-i18next';
import { crc32 } from 'crc';
import { resources } from './resources';
import { languageDetector } from './language';
import { useState, useEffect } from 'react';

i18next
  .use(languageDetector)
  .use(initReactI18next)
  .init({
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

/**
 * 设置i18next的语言
 */
export async function setLanguage(lang: string): Promise<void> {
  return new Promise((resolve, reject) => {
    i18next.changeLanguage(lang, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

/**
 * fork from i18next/react-i18next/-/blob/src/useTranslation.js
 * i18n for react 使用hooks
 */
export function useTranslation() {
  const { t: i18nT } = useI18NTranslation();

  const [_t, _setT] = useState<TFunction>(() => t);
  useEffect(() => {
    _setT(() => (...args) => (t as any)(...args));
  }, [i18nT]);

  return { t: _t };
}
