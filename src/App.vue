<script>
import DarkModeToggle from "@/components/DarkModeToggle.vue";
import axios from "axios";

export default{
  components: {DarkModeToggle},
  data() {
    return {
      darkMode: null,
    };
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        document.body.classList.add('transition')
      });
    });

    this.loadTranslations();
  },
  methods: {
    setDarkMode(val){
      this.darkMode = val;
    },

    async loadTranslations() {
      await axios
          .get('/api/translations', {params: {}})
          .then(response => {
            this.$translator.setStrings(response.data);
          }).catch(error => {
            alert(error);
          });
    }
  }
}
</script>

<template>
  <DarkModeToggle @change="setDarkMode" />
  <RouterView v-slot="{ Component }">
    <component :is="Component" :darkMode="darkMode" />
  </RouterView>
</template>

<style lang="scss">
@import "assets/base.scss";
@import "assets/formkit.scss";

html, body{
  height: 100%;
}

body {
  .tox-tinymce-aux{
    z-index: 2500;
  }

  .tox .tox-edit-area__iframe{
    background-color: transparent;
  }
}
</style>
