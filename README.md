# i18n

[![npm][npm-image]][npm-url]
[![download][download-image]][download-url]
[![commitizen][commitizen-image]][commitizen-url]

[npm-image]: https://img.shields.io/npm/v/@fatesigner/i18n.svg?style=for-the-badge
[npm-url]: https://npmjs.com/package/@fatesigner/i18n
[download-image]: https://img.shields.io/npm/dw/@fatesigner/i18n.svg?style=for-the-badge&color=green
[download-url]: https://npmjs.com/package/@fatesigner/i18n
[commitizen-image]: https://img.shields.io/badge/commitizen-friendly-green.svg?style=for-the-badge
[commitizen-url]: http://commitizen.github.io/cz-cli/

###
> i18n 国际化工具库

## 安装

```bash
npm i -S @fatesigner/i18n
```

## 使用
### src/i18n/messages.ts
```ts
import { createLocaleMessages } from '@fatesigner/i18n';

// 先创建一份本地化环境对象并导出
export const i18nMessages = createLocaleMessages({
  app: {
    name: '',
    sidebar: {
      shrink: '',
      unfold: ''
    },
    settings: {
      title: ''
    }
  }
});

// 导出本地化环境对象类型
export type I18nMessagesType = typeof i18nMessages;
```

```vue
<template>
  <!-- 传统方式：字符串 -->
  <div class="flex items-center p-5 border-4 border-indigo-600">
    <p>app.name： {{ $t('app.name') }}</p>
    <p>app.sidebar.shrink： {{ $t('app.sidebar.shrink') }}</p>
  </div>
  <!-- I18nx createLocaleMessages 创建的 messages 可直接通过变量方式传入 $t，结合 typescript 从而获得强类型提示和检查的特性 -->
  <div class="flex items-center p-5 border-4 border-indigo-600">
    <p>app.name： {{ $t(i18nMessages.app.name) }}</p>
    <p>app.sidebar.shrink： {{ $t(i18nMessages.app.sidebar.shrink) }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { i18nMessages } from './i18n/messages';

export default defineComponent({
  setup(){
    // 将输出: "app.name"
    console.log(i18nMessages.app.name);
    return {
      i18nMessages
    }
  }
});
</script>

```

### src/i18n/langs/zh-CN.ts
> 根据类型配置对应的语言环境消息
```ts
import { I18nMessagesType } from '../messages';

// 中文
export default {
  app: {
    name: 'i18n 国际化',
    sidebar: {
      shrink: '折叠',
      unfold: '展开'
    },
    settings: {
      title: '标题'
    }
  }
} as I18nMessagesType;
```

### src/i18n/langs/en-US.ts
```ts
import { I18nMessagesType } from '../messages';

// 英语
export default {
  app: {
    name: 'i18n locale',
    sidebar: {
      shrink: 'Shrink',
      unfold: 'Unfold'
    },
    settings: {
      title: 'Title'
    }
  }
} as I18nMessagesType;
```

### src/i18n/index.ts
```ts
import { I18nLanguageType, createVueI18n } from '@fatesigner/i18n';

// 定义默认显示语言，该变量可从缓存、环境变量中获取
const defaultLang: I18nLanguageType = 'zh_CN';

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
    loadLocale(langs) {
      return import(`./langs/${langs}`).then(async (msg) => {
        return msg.default;
      });
    }
  }
);

// 注册勾子，当语言包加载完成后执行
i18n.hooks.afterSet.tap(function (langs: I18nLanguageType) {
  // 动态改变您的 http request header，让服务器能提供支持的语言
  Axios.defaults.headers.common['Accept-Language'] = langs;
  // 改变当前 html 的 langs 标签
  document.querySelector('html').setAttribute('langs', langs);
});
```

### src/plugins/dayjs.ts
> 如果您的应用使用了类似 dayjs 的插件，这些插件拥有自己的国际化加载方式，您可以注册 i18n 的 afterSet 钩子
```ts
import dayjs from 'dayjs';

import { i18n } from '../i18n';

// 定义 dayjs 的语言包加载方式
const loadDayjsLang = async (langs: I18nLanguageType) => {
  if (langs === 'zh-CN') {
    import('dayjs/locale/zh-cn').then(() => {
      dayjs.locale('zh-cn');
    });
  } else {
    // 其他环境统一使用英文
    import('dayjs/locale/es-us').then(() => {
      dayjs.locale('es-us');
    });
  }
};

// 加载初始语言包
loadDayjsLang(i18n._.global.locale);

// 注册 i18n 勾子，每当切换语言之后，重新加载 dayjs 的语言包
i18n.hooks.afterSet.tapAsync(loadLang);
```

### src/plugins/moduleA.ts
> 如果您的应用包含多个模块，它们有各自的本地化语言信息，您可以注册 i18n 的 beforeSet 钩子，将 messages 合并
```ts
import { merge } from 'lodash-es';

// 定义该 moduleA 的语言包加载方式
const loadModuleALang = async (langs: I18nLanguageType) => {
  if (langs === 'zh-CN') {
    import('./langs/zh-cn').then((res) => {
      return res.default;
    });
  } else {
    // 其他环境统一使用英文
    import('./langs/es-us').then((res) => {
      return res.default;
    });
  }
};

// 加载初始语言包
loadModuleALang(i18n._.global.locale).then((res) => {
  merge(i18n._.global.messages[i18n._.global.locale], res);
});

// 注册 i18n 勾子，每当切换语言之前，将会执行
i18n.hooks.beforeSet.tapAsync((langs: I18nLanguageType, locale) => {
  return loadModuleALang(langs).then((res) => {
    // 合并 message 对象
    return merge(locale, res);
  });
});
```

### 合并后，新的 i18n messages 对象结构为：
```text
// i18n._.global.messages
{
  app: {
    sidebar: {
      shrink: '',
        unfold: ''
    },l
    settings: {
      title: ''
    }
  },
  moduleA: {
    title: '',
    message: ''  
  }
}
```

## Vue3
### src/main.ts
```ts
import { createApp } from 'vue';

import App from './App.vue';
import { i18n } from './i18n';

// 将 i18n._ 安装至 vue 实例中
const app = createApp(App).use(i18n._);

app.mount('#app');
```

### src/App.vue
```vue
<template>
  <div class="p-20">
    <div class="flex items-center p-5 mb-6 border-4 border-indigo-600">
      <div>选择语言：</div>
      <select @change="onLanguageChange" v-model="language">
        <option v-for="item in languages" :value="item.value">{{item.text}}</option>
      </select>
    </div>
    <div class="flex items-center p-5 border-4 border-indigo-600">
      <p>app.name： {{ $t(i18nMessages.app.name) }}</p>
      <p>app.sidebar.shrink： {{ $t(i18nMessages.app.sidebar.shrink) }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { I18nLanguageType } from '@fatesigner/i18n';
import { defineComponent, ref } from 'vue';

import { i18n, i18nMessages } from './i18n';

export default defineComponent({
  setup(){
    // 当前选中的语言
    const language = ref<I18nLanguageType>(i18n._.global.locale);

    // 定义语言列表
    const languages = [
      {
        name: 'CN',
        value: 'zh-CN',
        text: '简体中文'
      },
      {
        name: 'US',
        value: 'en-US',
        text: 'English'
      }
    ];

    // 用户切换语言
    const onLanguageChange = () => {
      i18n.set(language);
    };

    return {
      i18nMessages,
      language,
      languages,
      onLanguageChange
    }
  }
});
</script>
```
