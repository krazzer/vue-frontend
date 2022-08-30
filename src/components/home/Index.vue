<script lang="ts">
import {defineComponent} from 'vue'
import axios from "axios";
import loginMock from "./classes/mock";

loginMock.mock();

export default defineComponent({
  mounted() {
    axios
        .get('/api/home', {params: {}})
        .then(response => {
          if (!response.data.loggedIn) {
            this.$router.push({name: 'login'});
          }
        }).catch(error => {
      if (error.response.status !== 404) {
        console.error(error.response.status);
      }
    });
  }
});

</script>

<template>
  Welkom in het CMS.
</template>