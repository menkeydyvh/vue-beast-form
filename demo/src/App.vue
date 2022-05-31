<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider>
      <a-menu :openKeys="['0', '1']" @click="onMenuItemClick" mode="inline" theme="dark">
        <div
          style="
            height: 36px;
            line-height: 36px;
            color: #ffffff;
            text-align: center;
            font-size: 20px;
          "
        >
          各种示例
        </div>
        <a-sub-menu
          :key="`${itemIndex}`"
          v-for="(item, itemIndex) in menu"
          :title="item.title"
        >
          <a-menu-item
            v-for="(child, childIndex) in item.children"
            :key="`${itemIndex}-${childIndex}`"
            >{{ child.title }}
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff">
        <span style="font-size: 16px; font-weight: bold">{{
          selectData ? selectData.title : ""
        }}</span>
      </a-layout-header>
      <a-layout-content style="margin: 16px; overflow: auto; height: 80vh">
        <component :is="selectData ? selectData.component : null"></component>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script lang="ts">
import { defineComponent, ref, markRaw } from "vue";

interface MenuItem {
  title: string;
  base?: string;
  component?: any;
  children?: MenuItem[];
}

export default defineComponent({
  components: {}, 
  setup() {
    const menu = ref<MenuItem[]>([
        {
          title: "ant-design-vue",
          base: "ant",
          children: [
            {
              title: "示例表单",
              component: "sample.vue",
            },
            {
              title: "简易表单",
              component: "easyForm.vue",
            },
            {
              title: "FormItem-Label",
              component: "formItemLabel.vue",
            },
            {
              title: "Object",
              component: "objectForm.vue",
            },
            {
              title: "Group",
              component: "groupForm.vue",
            },
            {
              title: "Upload",
              component: "uploadForm.vue",
            },
            {
              title: "其他v-model组件",
              component: "otherModel.vue",
            },
            {
              title: "ApiTest",
              component: "apiForm.vue",
            },
          ],
        },
      ]),
      selectData = ref<MenuItem>();

    const onMenuItemClick = async (itemData: any) => {
        let data: MenuItem = null,
          base = "";
        itemData.key.split("-").forEach((item: number) => {
          if (data) {
            data = data.children[item];
          } else {
            data = menu.value[item];
            if (data.base) {
              base = data.base;
            }
          }
        });
        if (data) {
          const nData = { ...data },
            result: any = await getComponent(base, data.component);
          nData.component = markRaw(result.default);
          selectData.value = nData;
        }
      },
      getComponent = async (base: string, component: string) => {
        return await import(`./${base}/${component}`);
      };

    return {
      onMenuItemClick,
      menu,
      selectData,
    };
  },
});
</script>
