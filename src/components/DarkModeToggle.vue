<script lang="ts">

import {defineComponent} from "vue";
import { useTheme } from 'vuetify'

export default defineComponent({
  data() {
    return {
      darkMode: false,
      theme: useTheme()
    }
  },
  methods: {
    toggle() {
      this.darkMode         = !this.darkMode;
      localStorage.darkMode = JSON.stringify(this.darkMode);
    }
  },
  watch: {
    darkMode(val) {
      let body = document.body;

      this.theme.global.name = val ? 'dark' : 'light';

      body.classList.add('transitioning');
      body.classList.toggle('darkmode', val);

      body.addEventListener('transitionend', () => {
        body.classList.remove('transitioning');
      });
    }
  },
  mounted() {
    if (localStorage.darkMode) {
      this.darkMode = JSON.parse(localStorage.darkMode);
      return;
    }

    const colorSchemeQueryList = window.matchMedia('(prefers-color-scheme: dark)');

    const setColorScheme = (e: Event | MediaQueryList) => {
      if ("matches" in e) {
        this.darkMode = e.matches;
      }
    }

    setColorScheme(colorSchemeQueryList);
    colorSchemeQueryList.addEventListener('change', setColorScheme);
  }
});
</script>

<template>
  <button class="darkmode-toggle" @click="toggle()">
    Switch to {{ darkMode ? 'light' : 'dark' }}
  </button>
</template>

<style scoped>
.darkmode-toggle {
  position: absolute;
  z-index: 1;
  top: 10px;
  right: 10px;
}
</style>
