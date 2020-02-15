# i18n

[![npm][npm-image]][npm-url]
[![build][travis-image]][travis-url]
[![download][download-image]][download-url]
[![commitizen][commitizen-image]][commitizen-url]

[npm-image]: https://img.shields.io/npm/v/@fatesigner/i18n.svg?color=red
[npm-url]: https://npmjs.com/package/@fatesigner/i18n
[travis-image]: https://travis-ci.com/fatesigner/i18n.svg?branch=master&color=success
[travis-url]: https://travis-ci.com/fatesigner/i18n
[download-image]: https://img.shields.io/npm/dw/@fatesigner/i18n.svg?color=green
[download-url]: https://npmjs.com/package/@fatesigner/i18n
[commitizen-image]: https://img.shields.io/badge/commitizen-friendly-green.svg
[commitizen-url]: http://commitizen.github.io/cz-cli/

Web 国际化插件，基于 [kazupon/vue-i18n](https://github.com/kazupon/vue-i18n). 

## 安装

```bash
npm i -S @fatesigner/i18n
```

## 使用
### ./keys.ts
```ts
// 定义当前 App 用到的 locale keys
export const I18nkeys = {
  navbar: {
    logOut: 'logOut',
    dashboard: 'dashboard',
    github: 'github',
    theme: 'theme',
    size: 'size',
    profile: 'profile'
  },
  settings: {
    title: 'title',
    theme: 'theme'
  }
};

// 返回 keys type
export type I18nkeysType = typeof I18nkeys;
```
### ./lang/en-US.ts
```ts
import { I18nkeysType } from '../keys';

export const lang: I18nkeysType = {
  navbar: {
    logOut: 'Log Out',
    dashboard: 'Dashboard',
    github: 'Github',
    theme: 'Theme',
    size: 'Global Size',
    profile: 'Profile'
  },
  settings: {
    title: 'Page style setting',
    theme: 'Theme Color'
  }
};

export default lang;
```

### ./lang/zh-CN.ts
```ts
import { I18nkeysType } from '../keys';

export const lang: I18nkeysType = {
  navbar: {
    logOut: '退出登录',
    dashboard: '首页',
    github: '项目地址',
    theme: '换肤',
    size: '布局大小',
    profile: '个人中心'
  },
  settings: {
    title: '系统布局配置',
    theme: '主题色',
  }
};

export default lang;
```

### ./i18n.ts
```ts
import { VueI18n } from '@fatesigner/i18n';

import { I18nkeys } from './keys';

// 初始化 i18n 实例
export const i18n = new VueI18n(
  {
    keys: I18nkeys,
    // 提供一个加载 locale 方法
    loadLocale(lang) {
      // 加载本地 lang 语言包
      return import(`./lang/${lang}`).then(async (msg) => {
        return msg.default;
      });
    }
  },
  {
    locale: null,
    messages: {}
  }
);

// 对于引用的第三方 UI 库，需要为 html 添加 lang 标签，所以在这里注册 afterSet 勾子
i18n.hooks.afterSet.tap(function (lang) {
  document.querySelector('html').setAttribute('lang', lang);
});

// 预先初始化 zh-CN 语言
i18n.set('zh-CN');

window.setTimeout(function () {
  // 5s后，更新为 en-US 语言
  i18n.set('en-US');
}, 5000);

// i18n 的 keys 属性支持类型提示，当需要绑定 locale key 时，使用方式如下：
console.log(i18n.keys.navbar.profile); // => navbar.profile
```

### 初始化 vue app
```ts
import Vue from 'vue';
import { LanguageType } from '@fatesigner/i18n/interfaces';

import { i18n, I18nkeysType } from './i18n';

Vue.component('app', {
  template: `
    <section>
      <h1>vue-i18n demo</h1>
      <h2>{{ $t(i18nKeys.navbar.profile) }}</h2>
      <h2>{{ $t(i18nKeys.settings.title) }}</h2>
      <p>当前语言：{{ lang }}</p>
      <button @click="setLang()">切换</button>
   </section>`,
  data: (): {
    lang: LanguageType;
    locale: any;
    i18nKeys: I18nkeysType;
  } => ({
    lang: null,
    locale: null,
    i18nKeys: i18n.keys
  }),
  methods: {
    setLang() {
      // 切换语言
      if (this.lang === 'zh-CN') {
        i18n.set('en-US');
      } else {
        i18n.set('zh-CN');
      }
    }
  },
  mounted() {
    i18n.hooks.afterSet.tapAsync(async (lang) => {
      this.lang = lang;
 
      // 每次切换语言时，更新 ant design 库的 locale
      //因 ant design 的语言命名和标准的不一致，这里将-替换为_
      lang = lang.replace('-', '_');
      import(`ant-design-vue/lib/locale-provider/${lang}`).then((res) => {
        this.locale = res.default;
      });
    });
  }
});

const App = new Vue({
  // 设置 i18n
  i18n: i18n._,
  template: '<app />'
});

// 挂载 vue 实例
App.$mount('#app');
```

## API
### new VueI18n(config: [I18nConfig](#I18nConfig), options: [I18nOptions](#I18nOptions))
> 初始化 VueI18n 实例.

## 实例方法
### instance.set(lang: [LanguageType](#LanguageType))
> 加载指定的语言.

## 实例属性
### instance._
> [vue-i18n](https://github.com/kazupon/vue-i18n) 的实例

### instance.keys
> 访问当前已加载的 locale，支持类型提示
> i18n 的 keys 属性支持类型提示，当需要绑定 locale key 时，使用方式如下：
```html
<template>
  <div>
    <h2>{{ $t(i18n.keys.navbar.profile) }}</h2>
    <h2>{{ $t(i18n.keys.settings.title) }}</h2>  
 </div>
</template>
```
### instance.hooks
> 事件勾子，包含 beforeSet 和 afterSet<br />
> 一般需要改变源 locale 数据时监听 beforeSet 事件<br />
> 当不改变 源 locale，例如一些第三方 UI 框架，它们有自己的一套 locale 结构，这时可以监听 afterSet 事件
```ts
import moment from 'moment';

import { i18n } from './i18n';

i18n.hooks.afterSet.tapAsync(async (lang) => {
  // 导入 moment language
  if (lang === 'zh-CN') {
    import('moment/locale/zh-cn').then(() => {
      moment.locale(lang.toLocaleLowerCase());
    });
  } else {
    // 非中文环境统一使用英文
    import('moment/locale/fr').then(() => {
      moment.locale(lang.toLocaleLowerCase());
    });
  }
});
```
