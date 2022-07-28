import { onUnmounted } from 'vue';
import { LoaderFactory } from './factory/loader';
import factory from './factory';
import { ruleParse, ruleStringify } from './tool';
import type { App, Component, Directive } from 'vue';
import type { RuleType, PropsOptionType } from './types';

export * from './types';

export const BeastForm = factory();

export default {
  /**
   * vue.use 的时候使用
   * @param app 
   * @returns 
   */
  install: (app: App) => {
    app.component(BeastForm.name, BeastForm);
    return app;
  },
  /**
   * 导入组件缓存
   * @param data 
   */
  components: (data: {
    [key: string]: Component
  }) => {
    LoaderFactory.loaderComponents(data)
  },
  /**
   * 注册指令
   * @param key 
   * @param directive 
   */
  directive: (key: string, directive: Directive) => {
    BeastForm.directives[key] = directive

    onUnmounted(() => {
      delete BeastForm.directives[key]
    });
  },
  /**
   * 无法动态处理emits依然会有下方警告 但可以正常使用
   * [Vue warn]: Extraneous non-emits event 
   * @param names 
   */
  emits: (names: string | string[]) => {
    if (Array.isArray(names)) {
      BeastForm.emits.push(...names)
    } else {
      BeastForm.emits.push(names)
    }
  },
  /**
   * 规则字符串转换成规则对象
   * @param str 
   * @returns 
   */
  ruleParse: (str: string) => {
    return ruleParse(str)
  },
  /**
   * 对象规则转化成字符串
   * @param rules 
   * @param space 
   * @returns 
   */
  ruleStringify: (rules: RuleType | RuleType[], space?: number) => {
    return ruleStringify(rules, space)
  },
  /**
   * 设置基础的PropsOption 避免重复设置多次
   * @param po 
   */
  setBasePropsOption: (po: PropsOptionType) => {
    LoaderFactory.setbasePropsOption(po);
  },
  /**
   * 多框架的时候切换使用框架的form配置
   * @param framework 使用目前支持的框架包名称
   */
  useForm(framework: string) {
    BeastForm.useForm = framework;
  }
}