<script lang="ts">
import Base from "@/components/login/Base.vue";
import {defineComponent} from 'vue'

export default defineComponent({
  components: {Base},
  data() {
    return {
      emailRules: this.$validator.getEmailRules(),
      form: false,
      successMesssage: <null|string> null,
      errorMesssage: <null|string> null,
      email: '',
    }
  },
  methods: {
    sendPasswordResetLink() {
      if (!this.form) {
        return;
      }

      this.errorMesssage   = null;
      this.successMesssage = null;

      this.$appUtil.doAction('reset/send', {email: this.email}, (response: any) => {
        if (response.data.success) {
          this.successMesssage = this.$translator.tl('login.resetLinkSendSuccess');
          this.email = '';
        } else {
          this.errorMesssage = this.$translator.tl('login.resetLinkSendError');
        }
      });
    }
  }
});

</script>

<template>
  <Base>
    <v-form v-model="form" @submit.prevent="sendPasswordResetLink">
      <v-text-field prepend-inner-icon="mdi-email" :label="$translator.tl('login.emailAddress')" :model="email"
                    :rules="emailRules" required/>
      <v-btn type="submit" :disabled="!form" block>
        <template v-slot:prepend>
          <v-progress-circular v-if="$appUtil.isBusyLoading()" indeterminate size="20" width="2"/>
        </template>
        {{ $translator.tl('login.sendResetLink') }}
      </v-btn>
      <v-alert v-if="successMesssage" type="success" :text="successMesssage"></v-alert>
      <v-alert v-if="errorMesssage" type="error" :text="errorMesssage"></v-alert>
    </v-form>
    <router-link to="/login">{{ $translator.tl('login.backToLogin') }}</router-link>
  </Base>
</template>