<script lang="ts">
import {defineComponent} from 'vue'
import axios from "axios";
import homeMock from "./classes/mock";

export default defineComponent({
  mounted() {
    homeMock.mock();
    this.checkLogin();
  },
  methods: {
    logout() {
      axios
          .get('/api/logout', {params: {}})
          .then(() => {
            this.checkLogin();
          }).catch(error => {
            console.error(error);
          }
      );
    },

    checkLogin(){
      axios
          .get('/api/home', {params: {}})
          .then(response => {
            if (!response.data.loggedIn) {
              this.$router.push({name: 'login'});
            }
          }).catch(error => {
            console.error(error);
          }
      );
    }
  }
});

</script>

<script setup lang="ts">
  import Logo from "@/components/icons/Logo.vue";
</script>

<template>
  <div class="sidebar">
    <div class="sidebar__logo">
      <Logo />
    </div>
    <div class="sidebar__menu">
      <a href="javascript:void(0)" @click="logout">Uitloggen</a>
    </div>
  </div>
  <div class="main">
    Main
  </div>
</template>

<style lang="scss" scoped>
  $sideBarWidth: 250px;
  $mainPadding: 40px;

  .sidebar{
    width: $sideBarWidth;
    padding: $mainPadding;
    position: fixed;
    background-color: var(--color-background-shade1);
    height: 100%;
    overflow: auto;
    z-index: 1;
    transition: background-color .5s;

    &__logo{
      margin-bottom: $mainPadding;
    }

    &__menu{
      position: relative;
    }
  }

  .main{
    padding: $mainPadding $mainPadding $mainPadding $mainPadding + $sideBarWidth;
  }
</style>