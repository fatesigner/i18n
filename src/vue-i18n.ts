import { I18n, I18nOptions, createI18n } from 'vue-i18n';

import { createSyncHook, createSyncWaterfallHook } from './hook';
import { I18nHookType, I18nLanguageType, I18nLocaleType, I18nWaterfallHookType } from './core';

/**
 * Vue-i18n 实例
 */
export interface IVueI18nHandler<Options extends I18nOptions = Record<string, any>> {
  /**
   * Vue-i18n 原始实例
   */
  _: I18n<Options['messages'], Options['datetimeFormats'], Options['numberFormats'], Options['legacy'] extends boolean ? Options['legacy'] : true>;
  /**
   * 事件钩子
   */
  hooks: {
    /**
     * 在 setLocaleMessage 前执行，当需要覆盖全局语言环境变量时，可注册该钩子
     */
    beforeSet: I18nWaterfallHookType;
    /**
     * 在 setLocaleMessage 后执行
     */
    afterSet: I18nHookType;
  };
  /**
   * 设置语言环境、加载语言包
   * @param lang 语言
   */
  set: (lang: I18nLanguageType) => Promise<I18nLanguageType>;
}

/**
 * 创建 vue-i18n 实例
 * @param options
 * @param config
 */
export function createVueI18n<TOptions extends I18nOptions>(
  options: TOptions,
  config: {
    /**
     * 指定加载语言环境的方式（异步）
     * @param lang
     */
    loadLocale: (lang: I18nLanguageType) => Promise<I18nLocaleType>;
  }
): IVueI18nHandler<TOptions> {
  // 初始化 i18n 实例
  const _ = createI18n(options);

  // 定义变量保存当前已加载完成的语言包
  const loadedLangs: I18nLanguageType[] = [];

  const hooks = {
    beforeSet: createSyncWaterfallHook(),
    afterSet: createSyncHook()
  };

  return {
    _: _,
    hooks: hooks,
    set(lang: I18nLanguageType): Promise<I18nLanguageType> {
      return new Promise((resolve, reject) => {
        if (lang) {
          if (loadedLangs.includes(lang)) {
            _.global.locale = lang;
            hooks.afterSet.call(lang, this._.global.locale);
          } else {
            return config
              .loadLocale(lang)
              .then(async (locale) => {
                hooks.beforeSet
                  .call(lang, locale)
                  .then((res: any) => {
                    _.global.locale = lang;
                    _.global.setLocaleMessage(lang, res);
                    loadedLangs.push(lang);
                    hooks.afterSet.call(lang, res);
                    resolve(lang);
                  })
                  .catch((err) => {
                    reject(err);
                  });
              })
              .catch((err) => {
                reject(err);
              });
          }
          resolve(lang);
        } else {
          resolve(null);
        }
      });
    }
  };
}
