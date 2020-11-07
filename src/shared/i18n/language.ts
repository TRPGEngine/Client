import { LanguageDetectorAsyncModule } from 'i18next';
import rnStorage from '@shared/api/rn-storage.api';
import { useRNStorage } from '@shared/hooks/useRNStorage';
import { useRef, useMemo, useCallback } from 'react';
import _isNil from 'lodash/isNil';
import { setLanguage as setI18NLanguage } from './index';
import { LANGUAGE_KEY } from '@shared/utils/consts';

export const defaultLanguage = 'zh-CN';

/**
 * 获取当前语言
 */
export async function getLanguage(): Promise<string> {
  return await rnStorage.get(LANGUAGE_KEY, defaultLanguage);
}

/**
 * 当前语言管理hook
 */
export function useLanguage() {
  const [language, set] = useRNStorage(LANGUAGE_KEY, defaultLanguage, true);

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
  await rnStorage.save(LANGUAGE_KEY, lang);
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
