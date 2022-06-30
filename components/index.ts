import type { App, Component, Directive } from 'vue';
import { LoaderFactory } from './factory/loader';
import factory from './factory';
import { ruleParse, ruleStringify } from './tool';
import type { RuleType } from './types';


export * from './types';

export const JsonLayout = factory();

export default {
  install: (app: App) => {
    app.component(JsonLayout.name, JsonLayout);
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
    JsonLayout.directives = {
      [key]: directive
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
  }
}