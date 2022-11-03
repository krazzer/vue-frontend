<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  methods: {

  }
});
</script>

<template>
  <div class="media">
    <div class="media__toolbar">
      <input type="file" name="Uploaden" class="btn" multiple />
    </div>
    <div class="media__files">

    </div>
  </div>
</template>

<style lang="scss" scoped>
.media{

  &__toolbar{
    margin-bottom: 45px;
  }

  &__files{
    width: 100%;
    min-height: 200px;
    background-color: var(--color-background-shade1);
    transition: background-color var(--color-scheme-transition-speed);
  }
}
</style>