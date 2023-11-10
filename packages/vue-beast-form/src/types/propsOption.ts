import { Directive } from "vue";

export type PropsOptionType = {
    form?: Record<string, any>;
    isForm?: boolean;
    isI18n?: boolean;
    // 使用的框架名称
    framework: string
    // 注册自定义指令
    directives: Record<string, Directive>
    // 注册自定义emits
    emits: string[]
}
