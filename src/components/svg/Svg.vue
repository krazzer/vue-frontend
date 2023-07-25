<script lang="ts">
import {defineComponent} from 'vue'

const modules = import.meta.glob('@/assets/icons/*.svg', {as: 'raw'});

export default defineComponent({
  name: "Svg",
  props: ['svg'],
  methods: {
    getIcon() {
      let defaultIcon = '';

      for (const key in modules) {
        const name = key.split('/').reverse()[0].split('.')[0];

        if (name == this.svg) {
          return modules[key];
        }

        if (name == 'default') {
          defaultIcon = String(modules[key]);
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
  },
})
</script>

<template>
  <span class="icon" v-if="isSvg()" v-html="svg"></span>
  <span class="icon" :class="'icon--' + svg" v-else v-html="getIcon()"></span>
</template>