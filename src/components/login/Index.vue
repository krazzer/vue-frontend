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
      errors: <Array<string>>[],
    }
  },
  methods: {
    async login(params: object) {

      this.loginStatus = {};
      this.errors      = [];

      await axios
          .get('/api/login', {params: params})
          .then(response => {
            this.loginStatus = response.data;

            if (this.loginStatus.success) {
              this.$router.push({name: 'home'});
            } else {
              this.errors.push('Wrong e-mail or password');
            }
          })
          .catch(error => {
            this.errors.push(error.message);
          });
    }
  },
});
</script>

<script setup lang="ts">
import Base from "@/components/login/Base.vue";
import {FormKit} from "@formkit/vue";
import {markRaw} from "vue"
import InlineSvg from 'vue-inline-svg';
</script>

<template>
  <Base>
    <FormKit type="form" submit-label="Inloggen" id="loginform" @submit="login" v-model="form">
      <FormKit outer-class="email" label="e-mail" placeholder="E-mail adres" validation="required|email" v-model="email"
               :sections-schema="{
              prefix: {
                $el: 'div',
                attrs: {class: 'icon'},
                children: [{$cmp: markRaw(InlineSvg), props: {src: this.$assets + 'icons/email.svg'}}],
              }
            }" name="email"
      />
      <FormKit type="password" placeholder="Wachtwoord" validation="required" outer-class="password" v-model="password"
               :errors="errors" :sections-schema="{
              prefix: {
                $el: 'div',
                attrs: {class: 'icon'},
                children: [{$cmp: markRaw(InlineSvg), props: {src: this.$assets + 'icons/lock.svg'}}],
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