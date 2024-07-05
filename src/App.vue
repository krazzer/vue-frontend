<script lang="ts">
import axios from "axios";
import { useTheme } from 'vuetify'

export default {
  components: {},
  data() {
    return {
      colorSchemeQueryList: <MediaQueryList> window.matchMedia('(prefers-color-scheme: dark)'),
      darkMode: true,
      theme: useTheme(),
    };
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        document.body.classList.add('transition')
      });
    });

    if (localStorage.darkMode) {
      this.$darkMode.value = JSON.parse(localStorage.darkMode);
    }

    this.loadTranslations();
    this.setMode(false);

    this.colorSchemeQueryList.addEventListener('change', this.setColorScheme);
  },
  watch: {
    '$darkMode.value'(){
      if(this.$darkMode.value === this.$darkMode.DEFAULT){
        this.setColorScheme(this.colorSchemeQueryList)
      } else {
        this.darkMode = this.$darkMode.getDarkMode();
      }
    },
    darkMode() {
      this.setMode(true);
    },
  },
  methods: {
    async loadTranslations() {
      await axios
          .get('/api/translations', {params: {}})
          .then(response => {
            this.$translator.setStrings(response.data);
          }).catch(error => {
            alert(error);
          });
    },

    setColorScheme(e: Event | MediaQueryList) {
      if(this.$darkMode.value != this.$darkMode.DEFAULT){
        return;
      }

      if ("matches" in e) {
        this.darkMode = e.matches;
      }
    },

    /**
     * @param transition
     */
    setMode(transition: boolean){
      let body = document.body;
      let globalTheme: any = this.theme.global;

      globalTheme.name = this.darkMode ? 'dark' : 'light';

      if(transition) {
        body.classList.add('transitioning');
        body.addEventListener('transitionend', () => {
          body.classList.remove('transitioning');
        });
      }

      body.classList.toggle('darkmode', this.darkMode);
    }
  }
}
</script>

<template>
  <RouterView v-slot="{ Component }">
    <component :is="Component" :darkMode="darkMode"/>
  </RouterView>
</template>

<style lang="scss">
@import "assets/base.scss";
@import "assets/formkit.scss";

html, body {
  height: 100%;
}

body {
  .tox-tinymce-aux {
    z-index: 2500;
  }

  .tox .tox-edit-area__iframe {
    background-color: transparent;
  }
}
</style>
