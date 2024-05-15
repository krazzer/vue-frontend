<script lang="ts">
import Svg from "@/components/svg/Svg.vue";
import {defineComponent} from "vue";

export default defineComponent({
  components: {Svg},
  emits: ['startDrag'],
  name: "Page",
  props: ['cell', 'cloned', 'x', 'y', 'isDragged', 'dragAndDropPages', 'id'],
  computed: {
    pageStyle() {
      return this.cloned ? { 'margin-left': this.x + 'px', 'margin-top': this.y + 'px' } : '';
    },

    getClasses(){
      let classes = [];

      if(this.cloned === true){
        classes.push('cloned')
      }

      if(this.isDragged){
        classes.push('dragged')
      }

      if(this.dragAndDropPages !== undefined && this.dragAndDropPages.isDragging() && ! this.dragAndDropPages.isDragged(this.id)){
        if(this.dragAndDropPages.isHovering(this.id)) {
          classes.push('hovering');
        }
      }

      return classes;
    }
  }
});
</script>

<template>
  <span class="arrow"></span>
  <span class="name" :class="getClasses" @mousedown="$emit('startDrag', $event)" @mouseleave="dragAndDropPages.mouseLeave" @mouseenter="dragAndDropPages.mouseEnter(id)" :style="pageStyle">
    <template v-if="typeof cell === 'object'">
      <template v-for="icon in cell['icons']"><Svg :svg="icon"/></template>
      {{ cell['label'] }}
    </template>
    <template v-else>{{ cell }}</template>
  </span>
</template>

<style lang="scss" scoped>
.name{
  border: 1px solid var(--color-background-shade3);
  width: 200px;
  border-radius: var(--border-radius);
  display: block;
  padding: 2px 10px 4px;
  cursor: move;
  background-color: var(--color-background-shade1);
  position: relative;

  .icon{
    display: block;
    fill: var(--color-text);
    float: left;
    margin-right: 5px;
  }

  .icon--lock:deep(svg){
    width: 16px;
    height: 16px;
    top: 3px;
    margin-left: -1px;
    position: relative;
  }

  &.cloned{
    position: absolute;
    z-index: 1;
    pointer-events: none;
  }

  &.dragged{
    opacity: .25;
  }

  &.hovering{
    border: 3px solid var(--color-action);
    padding: 0 8px 2px;
  }
}
</style>