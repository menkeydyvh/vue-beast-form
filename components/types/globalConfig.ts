/**
 * 全局配置
 */
export interface GlobalConfigType {
    /**
     * 框架会内置一些ui库的配置 可以直接使用 或自定义一套新ui库进来
     */
    base: string
    /**
     * 配置多个框架名称方便导入默认配置
     */
    frameworks: GlobalConfigTypeFramework
}

/**
 * frameworks的配置规则
 */
export interface GlobalConfigTypeFramework {
    [frameworkName: string]: {
        /**
         * 表单form相关核心配置项
         */
        baseConfig: FrameworkFormBaseConfig;
        /**
         * 表单组件v-model:key配置key
         */
        model?: {
            [ComponentName: string]: string[]
        }
        /**
         * 表单组件v-model:key配置key的默认空值
         */
        defaultValue?: {
            [ComponentName: string]: any[];
        }
        /**
         * 表单组件v-model:key配置key修改的监听名称
         */
        modelEvent?: {
            [ComponentName: string]: string[];
        }
        /**
         * 表单组件disabled的值默认是disabled  
         * 假设禁用key不是disabled 是readonly 则需要配置: {ComponentName:"readonly"}
         */
        disabled?: {
            [ComponentName: string]: string;
        }
    }
}

/**
 * 表单form和formitem默认项
 */
export interface FrameworkFormBaseConfig {
    /**
     * 框架form组件的名称：例如'a-form'
     */
    form: string;
    /**
     * 表单数据对象：例如ant-design-vue的model
     */
    formPropsModel: string;
    /**
    * 框架form组件的formItem名称：例如'a-form-item'
    */
    formItem: string;
    /**
     * formItem对应model上的key：例如'name'
     */
    formItemPropName: string;
    /*
     * formItem对应model上的key：例如'name'
     */
    formItemPropRules: string;
    /**
     * formItem对应标题label的key：例如'label'
     */
    formItemPropLabel: string;
    /**
     * formItem对应标题label的插槽key：例如'label'
     */
    formItemSlotTitle: string;
    /**
     * form事件 表单验证事件名称
     */
    formEventValidate: string;
    /**
     * form事件 表单清除验证事件名称
     */
    formEventClearValidate: string;
}
