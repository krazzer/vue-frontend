<script setup lang="ts">
import Base from "@/components/login/Base.vue";
import Lock from "@/components/icons/Lock.vue";
import Email from "@/components/icons/Email.vue";
import {FormKit} from "@formkit/vue";

const login = () => {
  alert('Login!');
};

</script>

<template>
  <Base>
    <FormKit type="form" submit-label="Inloggen" @submit="login">
      <FormKit name="email" outer-class="email" placeholder="E-mail adres" validation="required|email"
               :sections-schema="{
              prefix: {
                $el: 'div',
                attrs: {class: 'icon'},
                children: [{$cmp: Email}],
              }
            }"
      />
      <FormKit type="password" name="password" placeholder="Wachtwoord" validation="required" outer-class="password"
               :sections-schema="{
              prefix: {
                $el: 'div',
                attrs: {class: 'icon'},
                children: [{$cmp: Lock}],
              }
            }"
      />
      <FormKit type="checkbox" name="remeber" label="Onthoud mij"/>
    </FormKit>
    <router-link to="/login/password-lost">Wachtwoord vergeten?</router-link>
  </Base>
</template>