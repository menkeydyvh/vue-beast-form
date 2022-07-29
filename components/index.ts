import { LoaderFactory } from './factory/loader';
import createFactory from './factory';
import { ruleParse, ruleStringify } from './tool';
import type { CreateFactoryConfigType } from './factory';
import type { App, Component, Directive } from 'vue';
import type { RuleType, PropsOptionType } from './types';

export * from './types';

export const name = "BeastForm";

const config: CreateFactoryConfigType = {
  name,
  framework: '',
  directives: {},
  emits: [],
}

export default {
  config,

  /**
   * vue.use 的时候使用
   * @param app 
   * @returns 
   */
  install(app: App) {
    const bf = this.BeastForm();
    app.component(bf.name, bf);
    return app;
  },
  beastForm() {
    return createFactory(this.config)
  },
  /**
   * 导入组件缓存
   * @param data 
   */
  components(data: {
    [key: string]: Component
  }) {
    LoaderFactory.loaderComponents(data)
  },
  /**
   * 注册指令
   * @param key 
   * @param directive 
   */
  directive(key: string, directive: Directive) {
    this.config.directives[key] = directive
  },
  /**
   * 无法动态处理emits依然会有下方警告 但可以正常使用
   * @param names 
   */
  emits(names: string | string[]) {
    if (Array.isArray(names)) {
      this.config.emits = names
    } else {
      this.config.emits = [names]
    }
  },
  /**
   * 规则字符串转换成规则对象
   * @param str 
   * @returns 
   */
  ruleParse(str: string) {
    return ruleParse(str)
  },
  /**
   * 对象规则转化成字符串
   * @param rules 
   * @param space 
   * @returns 
   */
  ruleStringify(rules: RuleType | RuleType[], space?: number) {
    return ruleStringify(rules, space)
  },
  /**
   * 设置基础的PropsOption 避免重复设置多次
   * @param po 
   */
  setBasePropsOption(po: PropsOptionType) {
    LoaderFactory.setbasePropsOption(po);
  },
  /**
   * 使用哪个组件
   * @param frameworkName 
   */
  useFramework(frameworkName: string) {
    this.config.framework = frameworkName;
  }
}