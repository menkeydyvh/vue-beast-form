import { defineComponent, ref, getCurrentInstance } from "vue";
import factory from "../../../../components/factory";

export default defineComponent({
  components: {},
  props: ["rule", "modelValue", "option", "api"],
  setup() {
    const vm = getCurrentInstance();
    const f = new factory(vm);

    return () => f.render();
  },
});
