/**
 * 国际化语言类型
 */
export type I18nLanguageType =
  | 'af'
  | 'sq'
  | 'ar-SA'
  | 'ar-IQ'
  | 'ar-EG'
  | 'ar-LY'
  | 'ar-DZ'
  | 'ar-MA'
  | 'ar-TN'
  | 'ar-OM'
  | 'ar-YE'
  | 'ar-SY'
  | 'ar-JO'
  | 'ar-LB'
  | 'ar-KW'
  | 'ar-AE'
  | 'ar-BH'
  | 'ar-QA'
  | 'eu'
  | 'bg'
  | 'be'
  | 'ca'
  | 'zh-TW'
  | 'zh-CN'
  | 'zh-HK'
  | 'zh-SG'
  | 'hr'
  | 'cs'
  | 'da'
  | 'nl'
  | 'nl-BE'
  | 'en'
  | 'en-US'
  | 'en-EG'
  | 'en-AU'
  | 'en-GB'
  | 'en-CA'
  | 'en-NZ'
  | 'en-IE'
  | 'en-ZA'
  | 'en-JM'
  | 'en-BZ'
  | 'en-TT'
  | 'et'
  | 'fo'
  | 'fa'
  | 'fi'
  | 'fr'
  | 'fr-BE'
  | 'fr-CA'
  | 'fr-CH'
  | 'fr-LU'
  | 'gd'
  | 'gd-IE'
  | 'de'
  | 'de-CH'
  | 'de-AT'
  | 'de-LU'
  | 'de-LI'
  | 'el'
  | 'he'
  | 'hi'
  | 'hu'
  | 'is'
  | 'id'
  | 'it'
  | 'it-CH'
  | 'ja'
  | 'ko'
  | 'lv'
  | 'lt'
  | 'mk'
  | 'mt'
  | 'no'
  | 'pl'
  | 'pt-BR'
  | 'pt'
  | 'rm'
  | 'ro'
  | 'ro-MO'
  | 'ru'
  | 'ru-MI'
  | 'sz'
  | 'sr'
  | 'sk'
  | 'sl'
  | 'sb'
  | 'es'
  | 'es-AR'
  | 'es-GT'
  | 'es-CR'
  | 'es-PA'
  | 'es-DO'
  | 'es-MX'
  | 'es-VE'
  | 'es-CO'
  | 'es-PE'
  | 'es-EC'
  | 'es-CL'
  | 'es-UY'
  | 'es-PY'
  | 'es-BO'
  | 'es-SV'
  | 'es-HN'
  | 'es-NI'
  | 'es-PR'
  | 'sx'
  | 'sv'
  | 'sv-FI'
  | 'th'
  | 'ts'
  | 'tn'
  | 'tr'
  | 'uk'
  | 'ur'
  | 've'
  | 'vi'
  | 'xh'
  | 'ji'
  | 'zu';

/**
 * i18n 环境信息类型
 */
export type I18nLocaleType = Record<string, any>;

/**
 * i18n 普通事件钩子
 */
export type I18nHookType = {
  tap: (callback: (lang: I18nLanguageType, locale: I18nLocaleType) => void) => () => void;
  tapAsync: (callback: (lang: I18nLanguageType, locale: I18nLocaleType) => Promise<void>) => () => void;
  call: (lang: I18nLanguageType, locale: I18nLocaleType) => Promise<void>;
};

/**
 * i18n 瀑布流事件钩子
 */
export type I18nWaterfallHookType = {
  tap: (callback: (lang: I18nLanguageType, locale: I18nLocaleType) => I18nLocaleType) => () => void;
  tapAsync: (callback: (lang: I18nLanguageType, locale: I18nLocaleType) => Promise<I18nLocaleType>) => () => void;
  call: (lang: I18nLanguageType, locale: I18nLocaleType) => Promise<I18nLocaleType>;
};

/**
 * 创建 i18n 本地化字符串
 * @param localeMessageObject
 */
export function createLocaleMessages<T extends Record<string, any>>(localeMessageObject: T): T {
  if (typeof Proxy === 'function') {
    const getProp = function (target: any, propertyKey: string): string {
      const arr = [...target, propertyKey];
      let v = localeMessageObject;
      const hasProp = arr.every((prop: string) => {
        if (Object.prototype.hasOwnProperty.call(v, prop)) {
          v = v[prop];
          return true;
        }
        return false;
      });
      if (hasProp) {
        if (!(v == null || (typeof v !== 'function' && typeof v !== 'object'))) {
          return new Proxy(arr, { get: getProp });
        }
      }
      return arr.join('.');
    };
    return new Proxy([], {
      get: getProp
    });
  } else {
    const defineProperty = function (target, obj: T) {
      Object.keys(obj).forEach((propertyKey) => {
        Object.defineProperty(target, propertyKey, {
          get() {
            const arr = [...target, propertyKey];
            let v = localeMessageObject;
            const hasProp = arr.every((prop: string) => {
              if (Object.prototype.hasOwnProperty.call(v, prop)) {
                v = v[prop];
                return true;
              }
              return false;
            });
            if (hasProp) {
              if (!(v == null || (typeof v !== 'function' && typeof v !== 'object'))) {
                return defineProperty(arr, v);
              }
            }
            return arr.join('.');
          }
        });
      });
      return target;
    };
    return defineProperty([], localeMessageObject);
  }
}
