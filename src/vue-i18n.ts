/**
 * vue-i18n
 */

import Vue from 'vue';
import VueI18nC, { I18nOptions } from 'vue-i18n';

import { I18nConfig, I18nKeys, LanguageType } from './interfaces';
import { I18n } from './i18n';

Vue.use(VueI18nC);

export class VueI18n<T extends I18nKeys> extends I18n<T> {
  public _: any;

  // 定义变量保存当前已加载完成的语言包
  private readonly _loadedLangs: LanguageType[] = [];

  constructor(config: I18nConfig<T>, options: I18nOptions) {
    super(config);
    // 初始化 i18n 实例
    this._ = new VueI18nC(options);
  }

  set(lang: LanguageType): Promise<LanguageType> {
    return new Promise((resolve, reject) => {
      if (lang) {
        if (this._loadedLangs.includes(lang)) {
          this._.locale = lang;
          this.hooks.afterSet.call(lang, this._.locale);
        } else {
          return this.config
            .loadLocale(lang)
            .then(async (locale) => {
              this.hooks.beforeSet
                .call(lang, locale)
                .then((res: any) => {
                  this._.locale = lang;
                  this._.setLocaleMessage(lang, res);
                  this._loadedLangs.push(lang);
                  this.hooks.afterSet.call(lang, res);
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
}
