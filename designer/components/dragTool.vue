<template>
  <div
    class="dragTool"
    @click.stop="onActive"
    :class="{ active: state.active === onlyId }"
    :activeId="onlyId"
  >
    <div class="dragTool-left">
      <div
        v-if="state.active === onlyId && isDrag !== false"
        class="dragTool-btn dragBtn"
        title="移动"
      >
        M
      </div>
    </div>
    <div class="dragTool-right">
      <div class="dragTool-btn" @click.stop="$emit('dragToolAdd', onlyId)" title="添加">
        A
      </div>
      <!-- <div class="dragTool-btn" @click.stop="$emit('dragToolCopy', onlyId)" title="复制">
        C
      </div> -->
      <div
        class="dragTool-btn"
        v-if="isChild"
        @click.stop="$emit('dragToolAddChild', onlyId)"
        title="添加子节点"
      >
        AC
      </div>
      <div class="dragTool-btn" @click.stop="$emit('dragToolDel', onlyId)" title="删除">
        D
      </div>
    </div>
    <div class="dragTool-mask" v-if="isMask"></div>
    <slot></slot>
  </div>
</template>

<script>
import { defineComponent, ref, toRefs, inject, onBeforeUnmount } from "vue";
import { randomId } from "../../components/tool";

export default defineComponent({
  name: "DragTool",
  props: {
    isDrag: { type: Boolean },
    isChild: { type: Boolean },
    isMask: { type: Boolean },
    onlyId: { type: String },
  },
  components: {},
  setup(props, { emit }) {
    const { onlyId } = toRefs(props),
      state = inject("recordAcitve");

    const onActive = () => {
      if (state.value.active !== onlyId.value) {
        state.value.active = onlyId.value;
        emit("dragToolActive", onlyId.value);
      }
    };

    onBeforeUnmount(() => {
      state.value.active = null;
    });

    return {
      state,
      onActive,
    };
  },
});
</script>
