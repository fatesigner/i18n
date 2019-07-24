/**
 * i18n
 */

import { CreateSyncHook, CreateSyncWaterfallHook } from './hook';
import { I18nConfig, I18nHookType, I18nKeys, LanguageType } from './interfaces';

export function CreateI18nKeys(locale: any | any[]): any {
  if (typeof Proxy === 'function') {
    const getProp = function (target: any, property: string): string {
      target = [...target, property];
      let v = locale;
      const hasProp = target.every((prop: string) => {
        if (Object.prototype.hasOwnProperty.call(v, prop)) {
          v = v[prop];
          return true;
        }
        return false;
      });
      if (hasProp) {
        if (!(v == null || (typeof v !== 'function' && typeof v !== 'object'))) {
          return new Proxy(target, { get: getProp });
        }
      }
      return target.join('.');
    };
    return new Proxy([], {
      get: getProp
    });
  } else {
    return {};
  }
}

export abstract class I18n<T extends I18nKeys> {
  protected config: I18nConfig<T>;

  public keys: T;

  /**
   * 注册安装语言事件的勾子，返回一个函数，如果执行，将会取消该勾子，之后不再执行
   */
  public hooks = {
    beforeSet: CreateSyncWaterfallHook(),
    afterSet: CreateSyncHook()
  };

  protected constructor(config: I18nConfig<T>) {
    this.config = config;
    this.keys = CreateI18nKeys(config.keys);
  }

  /**
   * 加载语言包（抽象函数）
   * @param lang
   */
  abstract set(lang: LanguageType): Promise<LanguageType>;
}
