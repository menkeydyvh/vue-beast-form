<template>
  <a-card class="content-card" :bordered="false" title="JSON解析表单或解析成布局">
    <a-row>
      <a-col flex="auto">
        <a-space>
          <a-radio-group v-model:value="isForm" button-style="solid">
            <a-radio-button :value="true">解析成表单</a-radio-button>
            <a-radio-button :value="false">解析成布局</a-radio-button>
          </a-radio-group>
          <a-button @click="disabled = !disabled">{{
            disabled ? "启用表单" : "禁用表单"
          }}</a-button>
        </a-space>
        <json-layout
          v-model:api="jApi"
          v-model="value"
          :isForm="isForm"
          :rule="rule"
          :option="option"
          :disabled="disabled"
        />
      </a-col>
      <a-col flex="300px">
        <pre v-text="JSON.stringify(value, null, 4)" />
      </a-col>
    </a-row>
  </a-card>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import JsonLayout from "json-layout";
import type { RuleType, ApiFnType, PropsOptionType } from "json-layout/lib/types";

export default defineComponent({
  components: { JsonLayout },
  setup() {
    const jApi = ref<ApiFnType>(),
      disabled = ref(false),
      isForm = ref(true),
      value = ref({}),
      rule = ref<RuleType[]>([]),
      option = ref<PropsOptionType>({
        form: {
          wrapperCol: { span: 14 },
          layout: "vertical",
        },
      });

    rule.value = [
      {
        type: "a-input",
        title: "input",
        field: "input",
        value: "iphone 7",
        props: {
          type: "text",
        },
        validate: [{ required: true, message: "必须填写", trigger: "blur" }],
      },
      {
        type: "a-form-item",
        children: [
          {
            type: "a-space",
            children: [
              {
                type: "a-button",
                props: {
                  type: "primary",
                  htmlType: "sbumit",
                  onClick: () => {
                    if (isForm.value) {
                      jApi.value.validate((valid: boolean) => {
                        console.log(valid, jApi.value.getFormData(), value.value);
                      });
                    } else {
                      console.log("formData:", jApi.value.getFormData());
                    }
                  },
                },
                children: ["提交"],
              },
              {
                type: "a-button",
                props: {
                  onClick: () => {
                    value.value = {};
                  },
                },
                children: ["重置"],
              },
            ],
          },
        ],
      },
    ];

    return {
      isForm,
      disabled,
      jApi,
      value,
      rule,
      option,
    };
  },
});
</script>
