import { createI18n } from 'vue-i18n'

export default createI18n({
    legacy: false,
    globalInjection: true,
    locale: 'en-us',
    messages: {
        "zh-cn": {
            "商品名称1": "商品名称1",
            "商品名称2": "商品名称2",
            "提交": "提交",
            "重置": "重置",
            "设置1": "设置1",
            "onAdd设置": "onAdd设置",
        },
        "en-us": {
            "商品名称1": "goods name 1",
            "商品名称2": "goods name 2",
            "提交": "submit",
            "重置": "reset",
            "设置1": "set1",
            "onAdd设置": "onAdd set",
        }
    }
})