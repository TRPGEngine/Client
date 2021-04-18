/**
 * 这里存储了一些常量
 * 用于在 rnStorage 或其他一些地方使用来保持一致性
 */

/**
 * 是否使用新应用
 */
export const IS_NEW_APP = '__isNewApp';

/**
 * 是否为开发人员
 * 用于处理一些仅开发人员可见的东西
 */
export const IS_DEVELOPER = '__isDeveloper';

/**
 * 是否为内测用户
 */
export const IS_ALPHA_USER = 'isAlphaUser';

/**
 * 用于打印RTC调试的标识
 */
export const RTC_DEBUG = '__rtc_debug';

/**
 * web端
 * 是否关闭了appBanner
 * 用于确保如果用户手动关闭其不多次显示
 */
export const APP_BANNER_CLOSE = 'appBannerClose';

/**
 * 公告是否关闭
 */
export const ANNOUNCEMENT_BAR_CLOSE = 'announcementBarClose';

/**
 * 系统消息用的UUID
 */
export const SYSTE_CONVERSE_SPEC = 'trpgsystem';

/**
 * 系统语言的常量
 */
export const LANGUAGE_KEY = 'trpg:i18n:language';

/**
 * portal端的jwt存储key
 */
export const PORTAL_JWT_KEY = 'jwt';

/**
 * 小程序端的jwt存储key
 */
export const TARO_JWT_KEY = 'jwt';

/**
 * 是否已安装PWA
 * 仅用于web端 chrome浏览器
 */
export const PWA_INSTALLED = 'pwaInstalled';

/**
 * 可以手动指定远程服务器的地址, 用于测试
 */
export const SERVICE_URL = 'serviceUrl';
