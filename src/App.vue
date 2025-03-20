<script lang="ts">
import { useTheme } from 'vuetify'
import Loader from "@/components/icons/Loader.vue";

export default {
  components: {Loader},
  data() {
    return {
      colorSchemeQueryList: <MediaQueryList> window.matchMedia('(prefers-color-scheme: dark)'),
      darkMode: true,
      ready: false,
      fatalError: '',
      theme: useTheme(),
    };
  },
  async mounted() {
    await this.$nextTick(() => {
      setTimeout(() => {
        document.body.classList.add('transition')
      });
    });

    if (localStorage.darkMode) {
      this.$darkMode.value = JSON.parse(localStorage.darkMode);
    }

    this.setMode(false);

    await this.loadTranslations();

    this.ready = true;

    this.colorSchemeQueryList.addEventListener('change', this.setColorScheme);
  },
  watch: {
    $darkMode: {
      handler: 'handleDarkModeChange',
      deep: true
    },
    darkMode() {
      this.setMode(true);
    },
  },
  methods: {
    handleDarkModeChange() {
      if(this.$darkMode.value === this.$darkMode.DEFAULT){
        this.setColorScheme(this.colorSchemeQueryList)
      } else {
        this.darkMode = this.$darkMode.getDarkMode();
      }
    },

    async loadTranslations() {
      await this.$appUtil.doAction('translations', {}, (response: any) => {
        this.$translator.setStrings(response.data);
      }, {
        onError: (error: any) => {
          this.fatalError = error.message;
        }
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
  <div v-if="!ready && $appUtil.isBusyLoading() && !fatalError" class="main-loader">
    <Loader/>
  </div>
  <div v-if="fatalError" class="fatal-error">
    {{ fatalError }}
  </div>
  <RouterView v-if="ready && !fatalError" v-slot="{ Component }">
    <component :is="Component" :darkMode="darkMode"/>
  </RouterView>
</template>

<style lang="scss">
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
