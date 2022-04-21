
<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider>
      <a-menu :openKeys="['0']" @click="onMenuItemClick" mode="inline" theme="dark">
        <div style="height: 36px;line-height: 36px;color: #ffffff;text-align: center;font-size: 20px;">
          各种示例
        </div>
        <a-sub-menu :key="`${itemIndex}`" v-for="(item, itemIndex) in menu" :title="item.title">
          <a-menu-item v-for="(child, childIndex) in item.children" :key="`${itemIndex}-${childIndex}`">{{
            child.title
          }}
          </a-menu-item>
        </a-sub-menu>

      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff;">
        <span style="font-size: 16px;font-weight: bold;">{{ selectData ? selectData.title : '' }}</span>
      </a-layout-header>
      <a-layout-content style="margin:16px;overflow: auto;height: 80vh;">
        <component :is="selectData ? selectData.component : null"></component>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>


<script lang="ts">
import { defineComponent, ref, markRaw } from 'vue'

interface MenuItem {
  title: string;
  component?: any;
  children?: MenuItem[];
}

export default defineComponent({
  components: {},
  setup() {
    const menu = ref<MenuItem[]>([
      {
        title: 'ant-design-vue',
        children: [
          {
            title: '简易表单',
            component: './ant/easyForm.vue'
          },
          {
            title: 'FormItem-Label',
            component: './ant/formItemLabel.vue'
          }
        ]
      },
    ]), selectData = ref<MenuItem>();

    const onMenuItemClick = async (itemData: any) => {
      let data: MenuItem = null;
      itemData.key.split('-').forEach((item: number) => {
        if (data) {
          data = data.children[item];
        } else {
          data = menu.value[item];
        }
      })
      if (data) {
        const nData = { ...data },
          result: any = await getComponent(data.component);
        nData.component = markRaw(result.default);
        selectData.value = nData;
      }
    }, getComponent = async (component: string) => {
      return await import(component)
    }


    return {
      onMenuItemClick,
      menu,
      selectData
    }
  }

})
</script>
