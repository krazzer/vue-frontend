<script>
import DarkModeToggle from "@/components/DarkModeToggle.vue";

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
    })
  },
  methods: {
    setDarkMode(val){
      this.darkMode = val;
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
