<script>
import LoginPage from "@/components/LoginPage.vue";

export default{
  components: {LoginPage},
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        document.body.classList.add('transition')
      });
    })
  }
}
</script>

<template>
  <router-view/>
</template>

<style>
@import "assets/base.css";
@import "assets/formkit.css";
</style>
