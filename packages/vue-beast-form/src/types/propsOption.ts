import { Directive } from "vue";

export type PropsOptionType = {
    /**
     * form的props
     */
    form?: Record<string, any>;
    /**
     * 最外层是否是form 
     * isForm===false时候才会处理
     */
    isForm?: boolean;
    /**
     * 启用i18n
     */
    isI18n?: boolean;
    /**
     * 使用的框架名称
     */
    framework?: string;
}
