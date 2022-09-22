<script lang="ts">
import {defineComponent} from 'vue'
import axios from "axios";

interface LoginStatus {
  success?: boolean;
}

export default defineComponent({
  data() {
    return {
      loginStatus: <LoginStatus>{},
      email: '',
      password: '',
      remember: false,
      form: null,
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
          })
          .catch(error => {
            node.setErrors([error.message]);
          });
    }
  },
});
</script>

<script setup lang="ts">
import Base from "@/components/login/Base.vue";
import LockIcon from "@/components/icons/Lock.vue";
import EmailIcon from "@/components/icons/Email.vue";
import {FormKit} from "@formkit/vue";
import {markRaw} from "vue"
</script>

<template>
  <Base>
    <FormKit type="form" submit-label="Inloggen" id="loginform" @submit="login" v-model="form">
      <FormKit outer-class="email" label="e-mail" placeholder="E-mail adres" validation="required|email" v-model="email"
               :sections-schema="{
              prefix: {
                $el: 'div',
                attrs: {class: 'icon'},
                children: [{$cmp: markRaw(EmailIcon)}],
              }
            }" name="email"
      />
      <FormKit type="password" placeholder="Wachtwoord" validation="required" outer-class="password" v-model="password"
               :errors="loginStatus.success === false ? ['Wrong e-mail or password'] : []" :sections-schema="{
              prefix: {
                $el: 'div',
                attrs: {class: 'icon'},
                children: [{$cmp: markRaw(LockIcon)}],
              }
            }" label="password" name="password"
      />
      <FormKit type="checkbox" label="Onthoud mij" v-model="remember"/>
    </FormKit>
    <router-link :to="{ name: 'passwordLost' }">Wachtwoord vergeten?</router-link>
  </Base>
</template>

<style lang="scss">
.email, .password {
  .formkit-label {
    display: none;
  }
}
</style>