<script lang="ts">
import {defineComponent} from 'vue'
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import router from "@/router";

if(import.meta.env.DEV) {
  let mock = new MockAdapter(axios, {delayResponse: 0});

  mock.onGet("/api/login").reply((request) => {
    let params = request.params;

    return [200, {success: params.password == 'test'}];
  });
}

interface LoginStatus {
  success: boolean;
}

export default defineComponent({
  data() {
    return {
      loginStatus: <LoginStatus> {},
    }
  },
  methods: {
    async login(params?: object) {
      this.loginStatus = (await axios.get('/api/login', {params: params})).data;

      if(this.loginStatus.success){
        await router.push({ name: 'home' });
      }
    }
  },
});
</script>

<script setup lang="ts">
import Base from "@/components/login/Base.vue";
import Lock from "@/components/icons/Lock.vue";
import Email from "@/components/icons/Email.vue";
import {FormKit} from "@formkit/vue";
</script>

<template>
  <Base>
    <FormKit type="form" submit-label="Inloggen" @submit="login">
      <FormKit name="email" outer-class="email" placeholder="E-mail adres" validation="required|email"
               :sections-schema="{
              prefix: {
                $el: 'div',
                attrs: {class: 'icon'},
                children: [{$cmp: Email}],
              }
            }"
      />
      <FormKit type="password" name="password" placeholder="Wachtwoord" validation="required" outer-class="password"
               :sections-schema="{
              prefix: {
                $el: 'div',
                attrs: {class: 'icon'},
                children: [{$cmp: Lock}],
              }
            }"
      />
      <FormKit type="checkbox" name="remember" label="Onthoud mij"/>
    </FormKit>
    <router-link to="/login/password-lost">Wachtwoord vergeten?</router-link>
  </Base>
</template>