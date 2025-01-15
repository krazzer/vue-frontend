<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "LabelField",
  props: ['field'],
})
</script>

<template>
  <div v-html="field.content"></div>
</template>