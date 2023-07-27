<script lang="ts">
import {defineComponent, markRaw} from 'vue'
import axios from "axios";
import Base from "./Base.vue";
import {FormKit} from "@formkit/vue";
import InlineSvg from 'vue-inline-svg';
import Svg from "@/components/svg/Svg.vue";

interface LoginStatus {
  success?: boolean;
}

export default defineComponent({
  components: {Base, FormKit, InlineSvg, Svg},
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
          .post('/api/login', {params: params})
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
    },

    getRawInlineSvgCmp(): any{
      return markRaw(Svg);
    },
  },
});
</script>

<template>
  <Base>
    <FormKit type="form" submit-label="Inloggen" id="loginform" @submit="login" v-model="form">
      <FormKit outer-class="email" label="e-mail" placeholder="E-mail adres" validation="required|email" v-model="email"
               :sections-schema="{
              prefix: {
                $el: 'div',
                attrs: {class: 'icon'},
                children: [{$cmp: getRawInlineSvgCmp(), props: {svg: 'email'}}],
              }
            }" name="email"
      />
      <FormKit type="password" placeholder="Wachtwoord" validation="required" outer-class="password" v-model="password"
               :errors="errors" :sections-schema="{
              prefix: {
                $el: 'div',
                attrs: {class: 'icon'},
                children: [{$cmp: getRawInlineSvgCmp(), props: {svg: 'lock'}}],
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