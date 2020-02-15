/**
 * interfaces
 */

export type I18nKeys = {
  [key in string]: string | I18nKeys;
};

/**
 * 定义国际化语言类型
 */
export type LanguageType =
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

export type I18nLocaleType = string | Record<string, any>;

export type I18nHookType = {
  tap: (callback: (lang: LanguageType, locale: I18nLocaleType) => void) => () => void;
  tapAsync: (callback: (lang: LanguageType, locale: I18nLocaleType) => Promise<void>) => () => void;
  call: (lang: LanguageType, locale: I18nLocaleType) => Promise<void>;
};

export type I18nWaterfallHookType = {
  tap: (callback: (lang: LanguageType, locale: I18nLocaleType) => I18nLocaleType) => () => void;
  tapAsync: (callback: (lang: LanguageType, locale: I18nLocaleType) => Promise<I18nLocaleType>) => () => void;
  call: (lang: LanguageType, locale: I18nLocaleType) => Promise<I18nLocaleType>;
};

export interface I18nConfig<T> {
  keys: T;
  loadLocale: (lang: LanguageType) => Promise<I18nLocaleType>;
}
