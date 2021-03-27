import type { LanguageDetectorAsyncModule } from 'i18next';
import { useStorage } from '@shared/hooks/useStorage';
import { useRef, useMemo, useCallback } from 'react';
import _isNil from 'lodash/isNil';
import { setLanguage as setI18NLanguage } from './index';
import { LANGUAGE_KEY } from '@shared/utils/consts';
import { getStorage } from '@shared/manager/storage';

export const defaultLanguage = 'zh-CN';

/**
 * 获取当前语言
 */
export async function getLanguage(): Promise<string> {
  return await getStorage().get(LANGUAGE_KEY, defaultLanguage);
}

/**
 * 当前语言管理hook
 */
export function useLanguage() {
  const [language, set] = useStorage(LANGUAGE_KEY, defaultLanguage, true);

  const originLanguageRef = useRef<string>();

  const setLanguage = useCallback(
    async (newLanguage) => {
      if (_isNil(originLanguageRef.current)) {
        originLanguageRef.current = language;
      }

      set(newLanguage);
      await setI18NLanguage(newLanguage);
    },
    [language, set]
  );

  const isChanged = useMemo(() => {
    if (_isNil(originLanguageRef.current)) {
      return false;
    }

    return originLanguageRef.current !== language;
  }, [language]);

  return { language, setLanguage, isChanged };
}

/**
 * 存储语言
 * @param lang 语言代码
 */
export async function saveLanguage(lang: string) {
  await getStorage().save(LANGUAGE_KEY, lang);
}

/**
 * i18n语言检测中间件
 */
export const languageDetector: LanguageDetectorAsyncModule = {
  type: 'languageDetector',
  async: true,
  init: () => {},
  detect: async (callback) => {
    try {
      const language = await getLanguage();
      callback(language);
    } catch (error) {
      callback(defaultLanguage);
    }
  },
  cacheUserLanguage(language) {
    try {
      saveLanguage(language);
    } catch (error) {}
  },
};
