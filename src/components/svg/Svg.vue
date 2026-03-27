<script lang="ts">
import {defineComponent} from 'vue'

const modules = import.meta.glob('@/assets/icons/*.svg', {query: 'raw'});

export default defineComponent({
  name: "Svg",
  props: ['svg'],
  data() {
    return {
      icon: '',
    };
  },
  methods: {
    async getIcon(): Promise<string> {
      let defaultIcon = '';

      for (const key in modules) {
        const baseName = key.split('/').reverse()[0];

        if( ! baseName || ! modules[key]){
          continue;
        }

        const name = baseName.split('.')[0];

        if (name == this.svg) {
          return <string> await modules[key]();
        }

        if (name == 'default') {
          defaultIcon = String(await modules[key]());
        }
      }

      return defaultIcon;
    },

    isSvg() {
      if ( ! this.svg) {
        return false;
      }

      return this.svg.substring(0, 1) == '<';
    },

    async loadIconString() {
      this.icon = await this.getIcon();
    },
  },

  mounted() {
    this.loadIconString();
  },
})
</script>

<template>
  <span class="icon" v-if="isSvg()" v-html="svg"></span>
  <i v-else-if="svg" :class="'mdi mdi-' + svg"></i>
  <i v-else :class="'mdi mdi-cog'"></i>
</template>

<style lang="scss" scoped>
  .icon{
    position: relative;
  }
</style>