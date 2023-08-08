<script lang="ts">
import {defineComponent} from 'vue'
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
      emailRules: [
        (value: any) => {
          return value ? true : 'E-mail is required.'
        },
        (value: any) => {
          return (/.+@.+\..+/.test(value)) ? true : 'E-mail must be valid.';
        },
      ]
    }
  },
  methods: {
    async login() {
      this.loginStatus = {};
      this.errors      = [];

      if (!this.form) {
        return;
      }

      let params = {email: this.email, password: this.password, remember: this.remember};

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
    }
  }
});
</script>

<template>
  <Base>
    <v-form autocomplete="off" @submit="login" @submit.prevent v-model="form">
      <v-text-field
          prepend-inner-icon="mdi-email" v-model="email" label="E-mail adres" :rules="emailRules" required
          id="email" name="email"
      ></v-text-field>
      <v-text-field
          prepend-inner-icon="mdi-lock" v-model="password" type="password" label="Wachtwoord" required name="password"
      ></v-text-field>
      <v-checkbox v-model="remember" label="Onthoud mij"></v-checkbox>
      <v-btn type="submit" :disabled="!form" block>Inloggen</v-btn>
      <v-alert v-if="errors.length" type="error" :text="errors.join(', ')"></v-alert>
    </v-form>
    <router-link :to="{ name: 'passwordLost' }">Wachtwoord vergeten?</router-link>
  </Base>
</template>

<style lang="scss">
.email, .password {
  .formkit-label {
    display: none;
  }
}

.v-checkbox {
  margin-top: -20px;
  margin-bottom: -20px;
}

.v-alert {
  margin-top: 10px;
}

</style>