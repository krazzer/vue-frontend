<script>
import LoginPage from "@/components/LoginPage.vue";
import DarkModeToggle from "@/components/DarkModeToggle.vue";

export default{
  components: {DarkModeToggle, LoginPage},
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        document.body.classList.add('transition')
      });
    })
  }
}
</script>

<template id="app">
  <DarkModeToggle />
  <LoginPage />
</template>

<style>
@import "assets/base.css";
@import "assets/formkit.css";

#app {
  position: relative;
  margin: 0;
  padding: 0;

  font-weight: normal;
  min-height: 100vh;
}
</style>
