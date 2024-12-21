<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "DragAndDropRow",
  emits: ['mouseDownOnRearrange'],
  data() {
    return {
      mouseDownRearrange: false,
    }
  },
  methods: {
    actionMouseDown(row: any, action: any, e: MouseEvent) {
      if(action.type == 'rearrange'){
        this.mouseDownRearrange = true;
        this.$emit('mouseDownOnRearrange', true, row.id, e.clientY);
      }
    },

    actionMouseUp(){
      this.mouseDownRearrange = false;
    }
  },

  mounted() {
    window.addEventListener('mouseup', this.actionMouseUp);
  },
})
</script>