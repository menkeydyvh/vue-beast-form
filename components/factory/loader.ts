import { resolveComponent } from 'vue'
import { name } from '../index'
import Config from '../config'
import { firstToUpper, firstToLower } from '../tool'
import type { ComponentInternalInstance, VNodeTypes } from "vue"
import type { PropsOptionType } from "../types"

export const globalCache: {
    tagCacheComponents: {
        [key: string]: VNodeTypes
    },
    config: Config,
    t: any,
    basePropsOption: PropsOptionType
} = {
    tagCacheComponents: {},
    config: null,
    t: null,
    basePropsOption: null
}

export class LoaderFactory {

    constructor(vm: ComponentInternalInstance) {
        globalCache.config = new Config(vm)

        for (let key in vm.appContext.components) {
            globalCache.tagCacheComponents[key] = vm.appContext.components[key]
        }

        globalCache.tagCacheComponents[name] = resolveComponent(name);

        const vmProxy = vm?.proxy as any
        if (vmProxy.$t) {
            globalCache.t = vmProxy.$t
        }
    }

    static switchDefaultName(name: string) {
        globalCache.config.switchDefaultName(name);
    }

    static setbasePropsOption(propsOption: PropsOptionType) {
        if (propsOption && Object.keys(propsOption).length) {
            globalCache.basePropsOption = propsOption
        } else {
            globalCache.basePropsOption = null
        }
    }

    static loaderComponents(components: { [key: string]: VNodeTypes }) {
        if (components) {
            for (let key in components) {
                globalCache.tagCacheComponents[key] = components[key]
            }
        }
    }

    static getComponents(key: string): VNodeTypes | string {
        if (!key) {
            return null;
        }
        if (globalCache.tagCacheComponents[key]) {
            return globalCache.tagCacheComponents[key];
        }

        // 存在大写 
        if (/[A-Z]/.test(key)) {
            // AAbc 转换 a-abc
            let lowerKey = ""
            key.replace(/(?=([A-Z]))/g, "-").split('-').forEach(k => {
                if (k) {
                    lowerKey += firstToLower(k)
                }
            })
            if (globalCache.tagCacheComponents[lowerKey]) {
                return globalCache.tagCacheComponents[lowerKey];
            }
        } else {
            // 存在小写
            // a-abc 转换为 AAbc
            // abc 转为 Abc
            let upperKey = "";
            key.split('-').forEach(k => {
                if (k) {
                    upperKey += firstToUpper(k)
                }
            })
            if (globalCache.tagCacheComponents[upperKey]) {
                return globalCache.tagCacheComponents[upperKey];
            }
        }

        return key
    }
}