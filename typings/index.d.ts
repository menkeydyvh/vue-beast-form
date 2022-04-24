import type { Component, App } from 'vue'
import type { RuleType, PropsOptionType, ApiFnType } from '../components/types'

declare module 'json-layout' {
    export const name = 'JsonLayout';

    export const components: Record<string, Component>;
    export interface props {
        rule: RuleType;
        api: ApiFnType;
        option: PropsOptionType;
        modelValue: any
        isForm: boolean
        "update:api": Function
        "update:modelValue": Function
    }

    export function install(app: App): App

}