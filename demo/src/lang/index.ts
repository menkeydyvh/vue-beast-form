import { createI18n } from 'vue-i18n'

export default createI18n({
    legacy: false,
    globalInjection: true,
    locale: 'en-us',
    messages: {
        "zh-cn": {
            "商品名称1": "商品名称1"
        },
        "en-us": {
            "商品名称1": "goods name 1"
        }
    }
})