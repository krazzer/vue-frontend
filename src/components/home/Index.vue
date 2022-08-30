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

<template>
  Welkom in het CMS. <a href="javascript:void(0)" @click="logout">Uitloggen</a>
</template>