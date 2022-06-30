export type ConfigRuleType = {
    label?: string
    name: string
    /**
     * 蒙板开启后不可操作组件内容
     */
    isMask?: boolean
    /**
     * 菜单上的表示位置
     */
    tag?: string
    /**
     * 显示在菜单上可拖拽
     */
    showMenu?: boolean
    /**
     * 设置为false是禁止拖拽
     */
    isDrag?: boolean
    /**
     * 不需要拖拽层
     */
    drag?: boolean
    /**
     * 当前组件的子组件名称对应上头的name
     */
    children?: string
    /**
     * 初始化当前组件规则
     */
    rule: Function
    /**
     * 自定义当前组件props的布局规则
     */
    props?: Function
}