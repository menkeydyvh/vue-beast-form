import { LoaderFactory } from './factory/loader';
import { ruleParse as toolRuleParse, ruleStringify as toolRuleStringify } from './tool';
import { App, Component } from 'vue';
import { RuleType, PropsOptionType } from './types';
import FactoryComp from './factory/index'
export * from './types/index';

const core = () => {
  LoaderFactory.loaderComponents({
    [FactoryComp.name]: FactoryComp,
  })

  return FactoryComp;
}

export const BeastForm = core();

/**
  * vue.use 的时候使用
  * @param app 
  * @returns 
  */
export const install = (app: App) => {
  const copm = core();
  app.component(copm.name, copm);
  return app;
}

/**
 * 根据设置的name获取针对的api内容
 * @param name 
 * @returns 
 */
export const getApi = (name: string) => {
  return LoaderFactory.cacheApi(name);
}

/**
 * 导入组件缓存
 * @param data 
 */
export const components = (data: Record<string, Component>) => {
  LoaderFactory.loaderComponents(data);
}

/**
 * 规则字符串转换成规则对象
 * @param str 
 * @returns 
 */
export const ruleParse = (str: string) => {
  return toolRuleParse(str);
}

/**
 * 对象规则转化成字符串
 * @param rules 
 * @param space 
 * @returns 
 */
export const ruleStringify = (rules: RuleType | RuleType[], space?: number) => {
  return toolRuleStringify(rules, space);
}

/**
 * 设置基础的PropsOption 避免重复设置多次
 * @param po 
 */
export const setBasePropsOption = (po: PropsOptionType) => {
  LoaderFactory.setbasePropsOption(po);
}

