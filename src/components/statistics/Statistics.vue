<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  props: ['settings'],
  name: "Statistics",
})
</script>

<template>
  Statistieken
  <br>
  {{ settings }}
</template>

<style scoped lang="scss">
</style>