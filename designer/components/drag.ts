import { defineComponent, toRefs, h } from 'vue'
import draggable from 'vuedraggable';

export default defineComponent({
    name: 'Drag',
    components: { draggable },
    props: ["rule", "tag"],
    setup(props, { slots }) {
        const { rule, tag } = toRefs(props);


        return () => h(draggable, {
            class: `${tag.value}-drag`,
            ...rule.value.props
        }, {
            item: ({ element }) => {
                return h('div', {
                    class: 'drag-div'
                }, {
                    default: slots[element.slot]
                })
            }

        });
    },
});