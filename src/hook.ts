/**
 * hook
 * 定义勾子
 */

import { I18nLocaleType, I18nWaterfallHookType, I18nHookType, LanguageType } from './interfaces';

/**
 * 判断指定对象类型是否为 Promise
 * @param obj
 */
function isNativePromise(obj: any) {
  return (
    obj &&
    typeof obj.constructor === 'function' &&
    (Function.prototype.toString.call(obj.constructor).replace(/\(.*\)/, '()') ===
      Function.prototype.toString
        .call(/* native object */ Function)
        .replace('Function', 'Promise') // replacing Identifier
        .replace(/\(.*\)/, '()') ||
      Function.prototype.toString.call(obj.constructor).replace(/\(.*\)/, '()') ===
      Function.prototype.toString
        .call(/* native object */ Function)
        .replace('Function', 'AsyncFunction') // replacing Identifier
        .replace(/\(.*\)/, '()'))
  ); // removing possible FormalParameterList
}

/**
 * 创建普通勾子，不处理返回值
 */
export function CreateSyncHook(): I18nHookType {
  type Func = (lang: LanguageType, locale: any) => void;
  type AsyncFunc = (lang: LanguageType, locale: any) => Promise<void>;

  const hooks: (Func | AsyncFunc)[] = [];

  return {
    tap(func: Func) {
      hooks.push(func);
      const index = hooks.length - 1;
      return () => {
        hooks.splice(index, 1);
      };
    },
    tapAsync(func: AsyncFunc) {
      hooks.push(func);
      const index = hooks.length - 1;
      return () => {
        hooks.splice(index, 1);
      };
    },
    async call(lang, locale) {
      for (const hook of hooks) {
        if (isNativePromise(hook)) {
          await hook(lang, locale);
        } else {
          hook(lang, locale);
        }
      }
    }
  };
}

/**
 * 创建瀑布流勾子
 * 一个个向下执行，如果上一个 tap 有返回值，那么下一个 tap 的传入参数是上一个 tap 的返回值
 */
export function CreateSyncWaterfallHook(): I18nWaterfallHookType {
  type Func = (lang: LanguageType, locale: I18nLocaleType) => I18nLocaleType;
  type AsyncFunc = (lang: LanguageType, locale: I18nLocaleType) => Promise<I18nLocaleType>;

  const hooks: (Func | AsyncFunc)[] = [];

  return {
    tap(func: Func) {
      hooks.push(func);
      return () => {
        const index = hooks.findIndex((x) => x === func);
        if (index > -1) {
          hooks.splice(index, 1);
        }
      };
    },
    tapAsync(func: AsyncFunc) {
      hooks.push(func);
      return () => {
        const index = hooks.findIndex((x) => x === func);
        if (index > -1) {
          hooks.splice(index, 1);
        }
      };
    },
    async call(lang, locale) {
      let res = locale;
      for (const hook of hooks) {
        if (isNativePromise(hook)) {
          res = await (hook as AsyncFunc)(lang, res);
        } else {
          res = (hook as Func)(lang, res);
        }
      }
      return res;
    }
  };
}
