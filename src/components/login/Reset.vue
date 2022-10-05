<script setup lang="ts">
import Base from "@/components/login/Base.vue";
import InlineSvg from 'vue-inline-svg';
import {markRaw} from "vue"
import {FormKit} from "@formkit/vue";
import emailSvg from '@/assets/icons/email.svg';

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
                children: [{$cmp: markRaw(InlineSvg), props: {src: emailSvg}}],
              }
            }"
      />
    </FormKit>
    <router-link to="/login">Terug naar login</router-link>
  </Base>
</template>

<style lang="scss">
</style>