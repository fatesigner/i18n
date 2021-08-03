import { I18nLanguageType, createVueI18n } from '@fatesigner/i18n';

export * from './messages';

// 定义默认显示语言，该变量可从缓存、环境变量中获取
const defaultLang: I18nLanguageType = 'zh-CN';

// 创建 i18n 实例
export const i18n = createVueI18n(
  {
    locale: defaultLang,
    messages: {
      // 同步加载默认语言包，因为使用按需加载的方式，所以在此不导入其他语言包
      [defaultLang]: require(`./langs/${defaultLang}`).default
    },
    // 是否使用 vue-i18n Legacy API 模式，默认为 true
    legacy: true,
    // 当前不存在 message 键时，将会显式回退到指定的语言环境
    fallbackLocale: defaultLang,
    // 只保留那些完全没有翻译给定关键字的警告
    silentFallbackWarn: true
  },
  {
    // 定义您的本地化环境信息加载的方式，当调用 i18n.set('zh-CN') 时执行
    loadLocale(lang) {
      return import(`./langs/${lang}`).then(async (msg) => {
        return msg.default;
      });
    }
  }
);

// 注册勾子，当语言包加载完成后执行
i18n.hooks.afterSet.tap(function (lang: I18nLanguageType) {
  // 动态改变您的 http request header，让服务器能提供支持的语言
  // Axios.defaults.headers.common['Accept-Language'] = lang;
  // 改变当前 html 的 lang 标签
  document.querySelector('html').setAttribute('lang', lang);
});
