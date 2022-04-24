import { RuleType, PropsOptionType, ApiFnType } from '../components/types'

declare module 'json-layout' {
    export const rule: RuleType;
    export const api: ApiFnType;
    export const option: PropsOptionType;
    export const modelValue: any
    export const isForm: boolean
}