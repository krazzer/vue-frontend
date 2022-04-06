<script setup lang="ts">
import Base from "@/components/login/Base.vue";
import Email from "@/components/icons/Email.vue";
import {FormKit} from "@formkit/vue";

const sendPasswordResetLink = () => {
  alert('Send password reset link!');
};

</script>

<template>
  <Base>
    <FormKit type="form" submit-label="Stuur wachtwoord reset link" @submit="sendPasswordResetLink">
      <FormKit name="email" outer-class="email" placeholder="E-mail adres" validation="required|email"
               :sections-schema="{
              prefix: {
                $el: 'div',
                attrs: {class: 'icon'},
                children: [{$cmp: Email}],
              }
            }"
      />
    </FormKit>
    <router-link to="/login">Terug naar login</router-link>
  </Base>
</template>

<style lang="scss">
</style>