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
      <label class="btn upload" title="Upload bestanden vanaf uw computer">
        Uploaden <input type="file" name="files[]" multiple="multiple" />
      </label>
    </div>
    <div class="media__files">

    </div>
  </div>
</template>

<style lang="scss" scoped>
.media{

  &__toolbar{
    margin-bottom: 45px;

    .upload{
      input{
        display: none;
      }
    }
  }

  &__files{
    width: 100%;
    min-height: 200px;
    background-color: var(--color-background-shade1);
    transition: background-color var(--color-scheme-transition-speed);
  }
}
</style>