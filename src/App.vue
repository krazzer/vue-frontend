<script>
import DarkModeToggle from "@/components/DarkModeToggle.vue";

export default{
  components: {DarkModeToggle},
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
  <DarkModeToggle />
  <router-view/>
</template>

<style>
@import "assets/base.css";
@import "assets/formkit.css";
</style>
