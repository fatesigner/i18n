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
