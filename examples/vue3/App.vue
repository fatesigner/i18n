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
