<script setup lang="ts">
import Logo from "@/components/icons/Logo.vue";
import Lock from "@/components/icons/Lock.vue";
import Email from "@/components/icons/Email.vue";
import {FormKit} from "@formkit/vue";

const login = () => {
  alert('Login!');
};

</script>

<template>
  <div class="login">
    <div class="login-box">
      <div class="login-box__logo">
        <Logo/>
      </div>
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
    </div>
  </div>
</template>

<style lang="scss">
body {
  background: url("../assets/login-background.jpg") no-repeat center center fixed;
  background-size: cover;
}

.email, .password {
  .formkit-input {
    margin-left: 42px;
    padding-left: 8px;
  }
}

.formkit-inner .icon{
  width: 50px;
  height: 100%;
  position: absolute;
  padding: 13px 0 12px 0;
  text-align: center;
}

.formkit-inner .icon svg{
  height: 100%;
}
</style>

<style scoped>

.login {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: 100vh;
  width: 100%;
}

.login-box {
  background-color: var(--color-background);
  padding: 3rem;
  border-radius: 2rem;
  margin: 10px;
  box-shadow: rgba(0, 0, 0, 0.08) 0 4.48rem 5.27rem, rgba(0, 0, 0, 0.06) 0 1.87rem 2.2rem,
  rgba(0, 0, 0, 0.05) 0 1rem 1.17rem, rgba(0, 0, 0, 0.04) 0 0.56rem 0.66rem, rgba(0, 0, 0, 0.03) 0 0.29rem 0.35rem,
  rgba(0, 0, 0, 0.1) 0 0 0.8rem;
  width: 450px;
  text-align: left;
}

.login-box__logo {
  margin-bottom: 2rem;
}

.login-box__logo svg {
  width: 200px;
  display: block;
  margin: 0 auto;
}

.login-box__intro h2 {
  margin-top: 0;
}

h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}

.login:before {
  content: '';
  background-color: white;
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: .5;
}

body.transition .login:before {
  transition: background-color .5s, opacity .5s;
}

body.darkmode .login:before {
  background-color: black;
  opacity: .6;
}

@media (max-width: 500px) {
  .login-box {
    width: 100%;
    padding: 2rem;
  }

  .login-box__logo {
    margin-bottom: 2rem;
  }

  .login-box__logo svg {
    width: 175px;
  }
}
</style>
