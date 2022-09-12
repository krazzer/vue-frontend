<script lang="ts">
import {defineComponent} from 'vue'
import axios from "axios";
import loginMock from "./classes/mock";

interface LoginStatus {
  success?: boolean;
}

export default defineComponent({
  data() {
    return {
      loginStatus: <LoginStatus>{},
    }
  },
  methods: {
    async login(params: object, node: any) {
      this.loginStatus = {};

      node.setErrors([]);

      await axios
          .get('/api/login', {params: params})
          .then(response => {
            this.loginStatus = response.data;

            if (this.loginStatus.success) {
              this.$router.push({name: 'home'});
            }
          }).catch(error => {
            node.setErrors([error.message]);
          });
    }
  },
  mounted() {
    loginMock.mock();
  }
});
</script>

<script setup lang="ts">
import Base from "@/components/login/Base.vue";
import Lock from "@/components/icons/Lock.vue";
import Email from "@/components/icons/Email.vue";
import {FormKit} from "@formkit/vue";
import {markRaw} from "vue"
</script>

<template>
  <Base>
    <FormKit type="form" submit-label="Inloggen" @submit="login">
      <FormKit name="email" outer-class="email" placeholder="E-mail adres" validation="required|email"
               :sections-schema="{
              prefix: {
                $el: 'div',
                attrs: {class: 'icon'},
                children: [{$cmp: markRaw(Email)}],
              }
            }"
      />
      <FormKit type="password" name="password" placeholder="Wachtwoord" validation="required" outer-class="password"
              :errors="loginStatus.success === false ? ['Wrong e-mail or password'] : []" :sections-schema="{
              prefix: {
                $el: 'div',
                attrs: {class: 'icon'},
                children: [{$cmp: markRaw(Lock)}],
              }
            }"
      />
      <FormKit type="checkbox" name="remember" label="Onthoud mij"/>
    </FormKit>
    <router-link :to="{ name: 'passwordLost' }">Wachtwoord vergeten?</router-link>
  </Base>
</template>