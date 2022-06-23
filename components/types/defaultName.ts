export interface DefaultName {
    /**
     * 框架form组件的名称：例如'a-form'
     */
    form?: string;
    /**
    * 框架form组件的formItem名称：例如'a-form-item'
    */
    formItem?: string;
    /**
     * formItem对应model上的key：例如'name'
     */
    formItemPropName?: string;
    /*
     * formItem对应model上的key：例如'name'
     */
    formItemPropRules?: string;
    /**
     * formItem对应标题label的key：例如'label'
     */
    formItemPropLabel?: string;
    /**
     * formItem对应标题label的插槽key：例如'label'
     */
    formItemSlotTitle?: string;
    /**
     * form表单验证事件名称
     */
    formEventValidate?: string;
    /**
     * form表单清除验证事件名称
     */
    formEventClearValidate?: string;
}
