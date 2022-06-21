<template>
  <div
    class="dragTool"
    @click.stop="onActive"
    :class="{ active: state.active === id }"
    :data-id="id"
  >
    <div class="dragTool-left">
      <div v-if="state.active === id && isDrag !== false" class="dragTool-btn">
        <drag-outlined title="移动" />
      </div>
    </div>
    <div class="dragTool-right">
      <div class="dragTool-btn" @click.stop="$emit('dragToolAdd')">
        <plus-outlined title="添加" />
      </div>
      <div class="dragTool-btn" @click.stop="$emit('dragToolCopy')">
        <copy-outlined title="复制" />
      </div>
      <div class="dragTool-btn" v-if="isChild" @click.stop="$emit('dragToolAddChild')">
        <plus-square-outlined title="添加子节点" />
      </div>
      <div class="dragTool-btn" @click.stop="$emit('dragToolDel')">
        <delete-outlined title="删除" />
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script>
import { defineComponent, ref, toRefs, inject, onBeforeUnmount } from "vue";
// import {
//   DragOutlined,
//   DeleteOutlined,
//   PlusSquareOutlined,
//   CopyOutlined,
//   PlusOutlined,
// } from "@ant-design/icons-vue";

let cid = 1;
export default defineComponent({
  name: "DragTool",
  props: ["isDrag", "isChild"],
  components: {
    // DragOutlined,
    // DeleteOutlined,
    // PlusSquareOutlined,
    // CopyOutlined,
    // PlusOutlined,
  },
  setup(props, { emit }) {
    const id = ref(cid++),
      state = inject("recordAcitve");

    const onActive = () => {
      if (state.value.active !== id.value) {
        state.value.active = id.value;
      }
    };

    onBeforeUnmount(() => {
      state.value.active = null;
    });

    return {
      id,
      state,
      onActive,
    };
  },
});
</script>

<style>
.drag-tool {
  position: relative;
  min-height: 20px;
  box-sizing: border-box;
  padding: 2px;
  outline: 1px dashed #2e73ff;
  overflow: hidden;
  word-wrap: break-word;
  word-break: break-all;
}

.drag-tool .drag-tool {
  margin: 5px;
}

.drag-tool + .drag-tool {
  margin-top: 5px;
}

.drag-tool.active {
  outline: 2px solid #2e73ff;
}

.drag-tool.active > div > .drag-btn {
  display: flex;
}

.drag-tool .drag-btn {
  display: none;
}

.drag-r {
  position: absolute;
  right: 2px;
  bottom: 2px;
  z-index: 999;
}

.drag-l {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
}

.drag-btn {
  height: 18px;
  width: 18px;
  color: #fff;
  background-color: #2e73ff;
  text-align: center;
  line-height: 20px;
  padding-bottom: 1px;
  float: left;
  cursor: pointer;
  justify-content: center;
}

.drag-btn + .drag-btn {
  margin-left: 2px;
}

.drag-btn-danger {
  background-color: #ff2e2e;
}

.drag-btn i {
  font-size: 13px;
}
</style>
