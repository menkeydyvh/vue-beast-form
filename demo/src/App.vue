<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider>
      <!-- :openKeys="['0', '1']" -->
      <a-menu @click="onMenuItemClick" mode="inline" theme="dark">
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
import menuList, { MenuItem } from "./menu";

export default defineComponent({
  components: {},
  setup() {
    const menu = ref(menuList),
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
          getComponent(base, data);
        }
      },
      getComponent = (base, data) => {
        import(`./${base}/${data.component}`).then((result) => {
          selectData.value = {
            title: data.title,
            component: markRaw(result.default),
          };
        });
      };

    return {
      onMenuItemClick,
      menu,
      selectData,
    };
  },
});
</script>
