import { onUnmounted } from 'vue';
import { LoaderFactory } from './components/factory/loader';
import factory from './components/factory';
import { ruleParse, ruleStringify } from './components/tool';
import type { App, Component, Directive } from 'vue';
import type { RuleType } from './components/types';


export * from './components/types';

export const BeastForm = factory();

export default {
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