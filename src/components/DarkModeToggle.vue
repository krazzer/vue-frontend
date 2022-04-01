<script lang="ts">

import {defineComponent} from "vue";

export default defineComponent({
  data() {
    return {
      darkMode: false
    }
  },
  methods: {
    toggle() {
      this.darkMode = !this.darkMode;
    },
    setDark() {
      this.darkMode = true;
    },
    setLight() {
      this.darkMode = false;
    }
  },
  watch:{
    darkMode(val){
      document.body.classList.toggle('darkmode', val)
    }
  },
  mounted(){
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
