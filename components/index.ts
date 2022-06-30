import { onUnmounted } from 'vue';
import { LoaderFactory } from './factory/loader';
import factory from './factory';
import { ruleParse, ruleStringify } from './tool';
import type { App, Component, Directive } from 'vue';
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
    JsonLayout.directives[key] = directive

    onUnmounted(() => {
      delete JsonLayout.directives[key]
    });
  },
  /**
   * 
   * @param names 
   */
  emits: (names: string | string[]) => {
    // 添加emits
    if (Array.isArray(names)) {
      names.forEach(name => {
        let idx = JsonLayout.emits.findIndex(emit => emit === name)
        if (idx === -1) {
          JsonLayout.emits.push(name)
        }
      })
    } else {
      let idx = JsonLayout.emits.findIndex(emit => emit === names)
      if (idx === -1) {
        JsonLayout.emits.push(names)
      }
    }

    onUnmounted(() => {
      // 清理emits
      if (Array.isArray(names)) {
        names.forEach(name => {
          let idx = JsonLayout.emits.findIndex(emit => emit === name)
          if (idx > -1) {
            JsonLayout.emits.splice(idx, 1)
          }
        })
      } else {
        let idx = JsonLayout.emits.findIndex(emit => emit === names)
        if (idx > -1) {
          JsonLayout.emits.splice(idx, 1)
        }
      }
    })
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