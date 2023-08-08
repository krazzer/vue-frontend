<script lang="ts">
import Base from "@/components/login/Base.vue";
import validator from "@/classes/validator";
import {defineComponent} from 'vue'

export default defineComponent({
  components: {Base},
  data() {
    return {
      emailRules: validator.getEmailRules(),
      form: false
    }
  },
  methods: {
    sendPasswordResetLink(){
      if( ! this.form){
        return;
      }
      alert('Send password reset link!');
    }
  }
});

</script>

<template>
  <Base>
    <v-form v-model="form" @submit.prevent="sendPasswordResetLink">
      <v-text-field prepend-inner-icon="mdi-email" label="E-mail adres" :rules="emailRules" required></v-text-field>
      <v-btn type="submit" :disabled="!form" block>Stuur wachtwoord reset link</v-btn>
    </v-form>
    <router-link to="/login">Terug naar login</router-link>
  </Base>
</template>

<style lang="scss">
</style>