import type { DefaultName } from "./defaultName"

export interface ConfigOptionsType {
    /**
     * 框架会内置一些ui库的配置 可以直接使用 或自定义一套新ui库进来
     */
    base: string
    /**
     * 配置多个框架名称方便导入默认配置
     */
    frameworks: string[],
    /**
     * 表单form相关核心配置项
     */
    defaultName?: DefaultName;
    /**
     * 表单组件v-model:key配置key
     */
    formDataComponentKey?: {
        [componentName: string]: string | string[]
    }
    /**
     * 表单组件v-model:key配置key的默认空值
     */
    formDataComponentDefaultValue?: {
        [key: string]: any;
    }
    /**
     * 表单组件v-model:key配置key修改的监听名称
     */
    formDataComponentChangeKeyEvent?: {
        [key: string]: string | string[];
    }
}