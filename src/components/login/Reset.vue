<script lang="ts">
import Base from "@/components/login/Base.vue";
import validator from "@/classes/validator";
import {defineComponent} from 'vue'

export default defineComponent({
  components: {Base},
  data() {
    return {
      emailRules: validator.getEmailRules(),
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
          this.successMesssage = 'Send password reset link!';
          this.email = '';
        } else {
          this.errorMesssage = 'Failed!';
        }
      });
    }
  }
});

</script>

<template>
  <Base>
    <v-form v-model="form" @submit.prevent="sendPasswordResetLink">
      <v-text-field prepend-inner-icon="mdi-email" label="E-mail adres" :model="email" :rules="emailRules" required/>
      <v-btn type="submit" :disabled="!form" block>
        <template v-slot:prepend>
          <v-progress-circular v-if="$appUtil.isBusyLoading()" indeterminate size="20" width="2"/>
        </template>
        Stuur wachtwoord reset link
      </v-btn>
      <v-alert v-if="successMesssage" type="success" :text="successMesssage"></v-alert>
      <v-alert v-if="errorMesssage" type="error" :text="errorMesssage"></v-alert>
    </v-form>
    <router-link to="/login">Terug naar login</router-link>
  </Base>
</template>