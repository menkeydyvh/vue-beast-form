<template>
  <div>
    <div>JSON解析表单或解析成布局</div>

    <a-row>
      <a-col :span="18" style="height: 2000px">
        <a-space>
          <a-radio-group v-model:value="option.isForm" button-style="solid">
            <a-radio-button :value="true">解析成表单</a-radio-button>
            <a-radio-button :value="false">解析成布局</a-radio-button>
          </a-radio-group>
          <a-button @click="disabled = !disabled">{{
            disabled ? "启用表单" : "禁用表单"
          }}</a-button>
        </a-space>
        <beast-form v-model="value" :rule="rule" :option="option" :disabled="disabled" />
      </a-col>
      <a-col :span="6">
        <pre v-text="JSON.stringify(value, null, 4)" />
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { BeastForm, RuleType } from "vue-beast-form";
import { Toast } from "vant";

export default defineComponent({
  components: { BeastForm },
  setup() {
    const disabled = ref(false),
      value = ref({}),
      rule = ref<RuleType[]>([]),
      option = ref({
        form: {},
        isForm: true,
        framework: 'vant',
      });

    const selectOptions = [
      { value: "7", label: "iphone 7", disabled: true },
      { value: "71", label: "iphone 71", disabled: false },
      { value: "72", label: "iphone 72" },
      { value: "73", label: "iphone 73" },
    ];

    const cascaderOptions = [
      { value: "7", label: "iphone 7", disabled: true },
      {
        value: "71",
        label: "iphone 71",
        children: [
          { value: "72-1", label: "iphone 72-1" },
          { value: "72-2", label: "iphone 72-2" },
        ],
      },
      { value: "72", label: "iphone 72" },
      { value: "73", label: "iphone 73" },
    ];

    rule.value = [
      {
        type: "van-cell-group",
        props: { inset: true },
        children: [
          {
            type: "van-field",
            field: "value-input",
            props: {
              label: "输入框",
              rules: [{ required: true, message: "请填写用户名" }],
            },
          },
          {
            type: "van-field",
            field: "value-date-input",
            props: {
              label: "日期",
              readonly: true,
            },
            on: {
              click: (e, api) => {
                api.setValue("showCalendar", true);
              },
            },
          },
          {
            type: "van-field",
            field: "nameCascader",
            props: {
              label: "级联",
              readonly: true,
            },
            on: {
              click: (e, api) => {
                api.setValue("showCascader", true);
              },
            },
          },
          {
            type: "van-checkbox",
            field: "value-checkbox",
            children: ["复选框"],
          },
          {
            type: "div",
            children: ["下面是组合复选框："],
          },
          {
            type: "van-checkbox-group",
            field: "value-checkbox-group",
            children: selectOptions.map((item) => {
              return {
                type: "van-checkbox",
                props: {
                  name: item.value,
                  disabled: item.disabled === true,
                },
                children: [item.label],
              };
            }),
          },
          {
            type: "van-datetime-picker",
            field: "value-date",
            props: {
              type: "date",
              title: "选择年月日",
            },
          },
          {
            type: "van-field",
            field: "nameKeyNumber",
            props: {
              placeholder: "点击开关键盘输入",
              readonly: true,
            },
            on: {
              click: (e, api) => {
                api.setProps("value-keyboard", "show", true);
              },
            },
          },
          {
            type: "van-password-input",
            field: "namePassword",
            props: {
              focused: false,
            },
            on: {
              focus: (e, api) => {
                api.setProps("namePassword", "focused", true);
                api.setProps("value-password", "show", true);
              },
            },
          },
          {
            type: "van-picker",
            props: {
              columns: ["杭州", "宁波", "温州", "绍兴", "湖州", "嘉兴", "金华"],
            },
            on: {
              change: (v, index, api) => {
                Toast(`当前值: ${v}, 当前索引: ${index}`);
              },
            },
          },
          { type: "br" },
          {
            type: "van-radio-group",
            field: "value-radio",
            children: [
              { type: "van-radio", props: { name: "1" }, children: ["选择1"] },
              { type: "van-radio", props: { name: "2" }, children: ["选择2"] },
              { type: "van-radio", props: { name: "3" }, children: ["选择3"] },
            ],
          },
          { type: "br" },
          {
            type: "van-rate",
            field: "value-rate",
          },
          { type: "br" },
          {
            type: "van-search",
            field: "value-search",
          },
          { type: "br" },
          {
            type: "van-slider",
            field: "value-slider",
          },
          { type: "br" },
          {
            type: "van-stepper",
            field: "value-stepper",
          },
          { type: "br" },
          {
            type: "van-switch",
            field: "value-switch",
          },
        ],
      },
      // 日历选择
      {
        type: "van-calendar",
        field: "showCalendar",
        on: {
          confirm: (v, api) => {
            api.setValue("value-date-input", `${v.getMonth() + 1}/${v.getDate()}`);
            api.setValue("showCalendar", false);
          },
        },
      },
      // 级联选择
      {
        type: "van-popup",
        field: "showCascader",
        props: {
          round: true,
          position: "bottom",
        },
        children: [
          {
            type: "van-cascader",
            field: "value-cascader",
            props: {
              title: "请选择所在地区",
              options: [
                {
                  text: "浙江省",
                  value: "330000",
                  children: [{ text: "杭州市", value: "330100" }],
                },
                {
                  text: "江苏省",
                  value: "320000",
                  children: [{ text: "南京市", value: "320100" }],
                },
              ],
            },
            on: {
              close: (api) => {
                api.setValue("showCascader", false);
              },
              finish: ({ selectedOptions }, api) => {
                api.setValue(
                  "nameCascader",
                  selectedOptions.map((option) => option.text).join("/")
                );
                api.setValue("showCascader", false);
              },
            },
          },
        ],
      },
      //键盘
      {
        type: "van-number-keyboard",
        field: "value-keyboard",
        on: {
          "update:modelValue": (v, api) => {
            api.setValue("nameKeyNumber", v);
            api.setValue("value-keyboard", v);
          },
          blur: (api) => {
            api.setProps("value-keyboard", "show", false);
          },
        },
      },
      {
        type: "van-number-keyboard",
        field: "value-password",
        on: {
          "update:modelValue": (v, api) => {
            api.setProps("namePassword", "value", `${v}`);
            api.setValue("value-password", v);
          },
          blur: (api) => {
            api.setProps("namePassword", "focused", false);
            api.setProps("value-password", "show", false);
          },
        },
      },

      {
        type: "div",
        children: [
          {
            type: "van-button",
            props: {
              type: "primary",
            },
            children: ["提交"],
            on: {
              click: (e, api) => {
                if (option.value.isForm) {
                  api.validate((valid: boolean, data: any) => {
                    console.log(valid, data);
                  });
                } else {
                  // 不是form的时候获取数据
                  console.log("formData:", api.getFormData());
                }
              },
            },
          },
          {
            type: "van-button",
            children: ["重置"],
            on: {
              click: (e, api) => {
                api.resetFormData();
                api.clearValidate();
              },
            },
          },
        ],
      },
    ];

    return {
      disabled,
      value,
      rule,
      option,
    };
  },
});
</script>
