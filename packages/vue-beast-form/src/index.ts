import { LoaderFactory } from './core/loader';
import { ruleParse, ruleStringify, beastName } from './tool';
import { App, Directive, VNode } from 'vue';
import { RuleType, PropsOptionType } from './types';
import CoreComp from './core/index.vue'
export * from './types/index';

export default {
  _config: {
    name: beastName.BASE,
    framework: '',
    directives: {},
    emits: [],
  },

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
  /**
   * @returns 
   */
  beastForm() {
    CoreComp.props.config.default = this._config;
    return CoreComp
  },
  /**
   * 根据设置的name获取针对的api内容
   * @param name 
   * @returns 
   */
  getApi(name: string) {
    return LoaderFactory.cacheApi(name)
  },
  /**
   * 导入组件缓存
   * @param data 
   */
  components(data: Record<string, VNode>) {
    LoaderFactory.loaderComponents(data)
  },
  /**
   * 注册指令
   * @param key 
   * @param directive 
   */
  directive(key: string, directive: Directive) {
    this._config.directives[key] = directive
  },
  /**
   * 无法动态处理emits依然会有下方警告 但可以正常使用
   * @param names 
   */
  emits(names: string | string[]) {
    if (Array.isArray(names)) {
      this._config.emits = names
    } else {
      this._config.emits = [names]
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
    this._config.framework = frameworkName;
  }
}