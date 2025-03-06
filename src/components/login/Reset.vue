<script lang="ts">
import Base from "@/components/login/Base.vue";
import {defineComponent} from 'vue'

export default defineComponent({
  components: {Base},
  data() {
    return {
      form: false,
      errorMesssage: <null | string>null,
      password: '',
      passwordRepeat: '',
    }
  },
  watch: {
    password() {
      this.$nextTick(() => {
        (<any> this).$refs.passwordRepeat.validate();
      });
    },
  },
  methods: {
    sendPasswordResetLink() {
      if (!this.form) {
        return;
      }

      this.errorMesssage = null;

      let params = {
        password: this.password,
        userId: parseInt(<string>this.$route.params.id),
        id: this.$route.params.key,
        key: this.$route.params.token,
      };

      this.$appUtil.doAction('reset/setpassword', params, (response: any) => {
        if (response.data.success) {
          this.$router.push({name: 'home'});
        } else {
          this.errorMesssage = response.data.message;
        }
      }, {
        onError: (error: any) => {
          this.errorMesssage = error.message;
        }
      });
    },

    passwordsMatch(value: string) {
      return value === this.password || this.$translator.tl('login.passwordMismatch');
    }
  }
});

</script>

<template>
  <Base>
    <v-alert type="info" class="alert-top">
      {{ $translator.tl('login.enterNewPassword') }}
    </v-alert>
    <v-form v-model="form" @submit.prevent="sendPasswordResetLink">
      <v-text-field :label="$translator.tl('login.password')" v-model="password" :rules="[(v) => !!v]" required
                    type="password"/>
      <v-text-field :label="$translator.tl('login.repeatPassword')" v-model="passwordRepeat" required type="password"
                    :rules="[(v) => !!v, passwordsMatch]" ref="passwordRepeat"/>
      <v-btn type="submit" :disabled="!form" block>
        <template v-slot:prepend>
          <v-progress-circular v-if="$appUtil.isBusyLoading()" indeterminate size="20" width="2"/>
        </template>
        {{ $translator.tl('login.resetPasswordButton') }}
      </v-btn>
      <v-alert v-if="errorMesssage" type="error" :text="errorMesssage"></v-alert>
    </v-form>
    <router-link to="/login">{{ $translator.tl('login.backToLogin') }}</router-link>
  </Base>
</template>

<style lang="scss">
.alert-top {
  margin-bottom: 20px;
}
</style>