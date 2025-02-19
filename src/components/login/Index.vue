<script lang="ts">
import {defineComponent} from 'vue'
import Base from "./Base.vue";
import InlineSvg from 'vue-inline-svg';
import Svg from "@/components/svg/Svg.vue";

interface LoginStatus {
  success?: boolean;
}

export default defineComponent({
  components: {Base, InlineSvg, Svg},
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
    async login() {
      this.loginStatus = {};
      this.errors      = [];

      if (!this.form) {
        return;
      }

      let params = {email: this.email, password: this.password, remember: this.remember};

      await this.$appUtil.doAction('login', params, (response: any) => {
        this.loginStatus = response.data;

        if (this.loginStatus.success) {
          this.$router.push({name: 'home'});
        } else {
          this.errors.push(this.$translator.tl('login.wrongLogin'));
        }
      }, {
        onError: (error: any) => {
          this.errors.push(error.message);
        }
      });
    }
  }
});
</script>

<template>
  <Base>
    <v-form autocomplete="off" @submit="login" @submit.prevent v-model="form">
      <v-text-field prepend-inner-icon="mdi-email" v-model="email" :label="$translator.tl('login.emailAddress')"
                    required id="email" name="email" data-testid="email"/>
      <v-text-field prepend-inner-icon="mdi-lock" v-model="password" type="password"
                    :label="$translator.tl('login.password')" required name="password" data-testid="password"/>
      <v-checkbox v-model="remember" :label="$translator.tl('login.remember')"/>
      <v-btn type="submit" :disabled="!form || !password || !email" block>
        <template v-slot:prepend>
          <v-progress-circular v-if="$appUtil.isBusyLoading()" indeterminate size="20" width="2"/>
        </template>
        {{ $translator.tl('login.login') }}
      </v-btn>
      <v-alert v-if="errors.length" type="error" :text="errors.join(', ')"></v-alert>
    </v-form>
    <router-link :to="{ name: 'passwordLost' }">{{ $translator.tl('login.passwordLost') }}</router-link>
  </Base>
</template>

<style lang="scss">

.v-checkbox {
  margin-top: -20px;
  margin-bottom: -20px;
}

</style>