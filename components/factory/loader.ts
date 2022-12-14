import { resolveComponent } from 'vue'
import { name } from '../index'
import Config from '../config'
import { firstToUpper, firstToLower } from '../tool'
import type { ComponentInternalInstance, VNodeTypes } from "vue"
import type { PropsOptionType, ApiType } from "../types"

export const globalCache: {
    tagCacheComponents: {
        [key: string]: VNodeTypes
    },
    cacheApi?: {
        [name: string]: ApiType
    },
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
            globalCache.tagCacheComponents[key] = vm.appContext.components[key]
        }

        globalCache.tagCacheComponents[name] = resolveComponent(name);

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

        // ???????????? 
        if (/[A-Z]/.test(key)) {
            // AAbc ?????? a-abc
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
            // ????????????
            // a-abc ????????? AAbc
            // abc ?????? Abc
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