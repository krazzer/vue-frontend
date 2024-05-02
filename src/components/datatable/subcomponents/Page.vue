<script lang="ts">
import Svg from "@/components/svg/Svg.vue";
import {defineComponent} from "vue";

export default defineComponent({
  components: {Svg},
  emits: ['startDrag'],
  name: "Page",
  props: ['cell', 'cloned']
});
</script>

<template>
  <span class="arrow"></span>
  <span class="name" :class="cloned ? 'cloned' : ''" @mousedown="$emit('startDrag')">
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

  .icon{
    display: block;
    fill: var(--color-text);
    float: left;
    margin-right: 5px;

    :deep(svg) {
      height: 20px;
      width: 20px;
      position: relative;
    }
  }

  .icon--lock:deep(svg){
    width: 16px;
    height: 22px;
    top: 1px;
    margin-left: -1px;
  }

  &.cloned{
    position: absolute;
    margin-left: 10px;
    margin-top: 10px;
  }
}
</style>