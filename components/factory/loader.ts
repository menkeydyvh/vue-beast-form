import Config from '../config'
import { firstToUpper, firstToLower } from '../tool'
import type { ComponentInternalInstance, VNodeTypes } from "vue"

export const globalCache: {
    tagCacheComponents: {
        [key: string]: VNodeTypes
    },
    config: Config
} = {
    tagCacheComponents: {},
    config: null,
}


export class LoaderFactory {

    constructor(vm: ComponentInternalInstance) {
        globalCache.config = new Config(vm)
        globalCache.tagCacheComponents = vm.appContext.components
    }

    static loaderComponents(components: { [key: string]: VNodeTypes }) {
        if (components) {
            for (let key in components) {
                globalCache.tagCacheComponents[key] = components[key]
            }
        }
    }

    static getComponents(key: string): VNodeTypes | string {
        if (globalCache.tagCacheComponents[key]) {
            return globalCache.tagCacheComponents[key];
        }

        // a-abc 转换为 AAbc
        if (key.indexOf('-') > 0) {
            let upperKey = "";
            key.split('-').forEach(k => {
                upperKey += firstToUpper(k)
            })
            if (globalCache.tagCacheComponents[upperKey]) {
                return globalCache.tagCacheComponents[upperKey];
            }
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
        }

        return key
    }
}