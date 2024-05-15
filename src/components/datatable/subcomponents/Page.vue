<script lang="ts">
import Svg from "@/components/svg/Svg.vue";
import {defineComponent} from "vue";

export default defineComponent({
  components: {Svg},
  emits: ['startDrag'],
  name: "Page",
  props: ['cell', 'cloned', 'x', 'y'],
  computed: {
    pageStyle() {
      return this.cloned ? { 'margin-left': this.x + 'px', 'margin-top': this.y + 'px' } : '';
    }
  }
});
</script>

<template>
  <span class="arrow"></span>
  <span class="name" :class="cloned ? 'cloned' : ''" @mousedown="$emit('startDrag', $event)" :style="pageStyle">
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
    top: 2px;
    margin-left: -1px;
    position: relative;
  }

  &.cloned{
    position: absolute;
    z-index: 1;
    pointer-events: none;
  }
}
</style>