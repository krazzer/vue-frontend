<script lang="ts">
import {defineComponent} from 'vue'
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import router from "@/router";

if (import.meta.env.DEV) {
  let mock = new MockAdapter(axios, {delayResponse: 50});

  mock.onGet("/api/login").reply((request) => {
    let params = request.params;

    if (params.password == 'networkerror') {
      return axios.get("mock-network-error");
    }

    if (params.password == 'timeout') {
      return axios.get("mock-network-timeout");
    }

    if (params.password == 'error') {
      return [503];
    }

    return [200, {success: params.password == 'test'}];
  });

  mock.onGet("mock-network-error").networkError();
  mock.onGet("mock-network-timeout").timeout();
}

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
              router.push({name: 'home'});
            }
          }).catch(error => {
            node.setErrors([error.message]);
          });
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
              :errors="loginStatus.success === false ? ['Wrong e-mail or password'] : []" :sections-schema="{
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