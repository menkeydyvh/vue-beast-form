import Config from '../config/index'
import { firstToUpper, firstToLower } from '../tool'
import type { ComponentInternalInstance, VNode } from "vue"
import type { PropsOptionType, ApiType } from "../types"

export const globalCache: {
    tagCacheComponents: Record<string, VNode & { name?: string }>,
    cacheApi?: Record<string, ApiType>,
    config: Config,
    t: any,
    basePropsOption: PropsOptionType
} = {
    tagCacheComponents: {},
    cacheApi: {},
    config: null,
    t: null,
    basePropsOption: null
}

export class LoaderFactory {

    constructor(vm: ComponentInternalInstance) {
        globalCache.config = new Config(vm)

        for (let key in vm.appContext.components) {
            globalCache.tagCacheComponents[key] = vm.appContext.components[key] as VNode
        }

        const vmProxy = vm?.proxy as any
        if (vmProxy.$t) {
            globalCache.t = vmProxy.$t
        }
    }

    static cacheApi(name: string, value?: ApiType) {
        if (value) {
            globalCache.cacheApi[name] = value;
        } else {
            return globalCache.cacheApi[name]
        }
    }


    static removeCacheApi(name: string) {
        delete globalCache.cacheApi[name]
    }

    static switchFramework(name: string) {
        globalCache.config.switchFramework(name);
    }

    static setbasePropsOption(propsOption: PropsOptionType) {
        if (propsOption && Object.keys(propsOption).length) {
            globalCache.basePropsOption = propsOption
        } else {
            globalCache.basePropsOption = null
        }
    }

    static loaderComponents(components: Record<string, VNode>) {
        if (components) {
            for (let key in components) {
                globalCache.tagCacheComponents[key] = components[key]
            }
        }
    }

    static getComponents(key: string) {
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