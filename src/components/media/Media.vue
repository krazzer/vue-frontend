<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  props: ['settings'],
  data() {
    return {
      files: [],
    };
  },
  mounted() {
    if (this.settings) {
      this.files = this.settings.files;
    }
  },
  methods: {}
});
</script>

<template>
  <div class="media">
    <div class="media__toolbar">
      <label class="btn upload" title="Upload bestanden vanaf uw computer">
        Uploaden <input type="file" name="files[]" multiple="multiple"/>
      </label>
    </div>
    <div class="media__files">
      <div class="media__file" v-for="file in files">
        <div class="icon"></div>
        <div class="name">{{ file.name }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.media {

  &__toolbar {
    margin-bottom: 50px;

    .upload {
      input {
        display: none;
      }
    }
  }

  &__file {
    float: left;
    padding: 5px;
    height: 160px;

    .icon {
      width: 120px;
      height: 120px;
      background: url("@/assets/icons/map.svg") no-repeat center;
      background-size: 80px 80px;
    }

    .name {
      text-align: center;
    }
  }

  &__files {
    width: 100%;
    min-height: 480px;
    background-color: var(--color-background-shade1);
    transition: background-color var(--color-scheme-transition-speed);

    &:after {
      clear: both;
      content: "";
      display: table;
    }
  }
}
</style>