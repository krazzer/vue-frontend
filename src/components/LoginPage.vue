<script setup lang="ts">
// defineProps<{
//   msg: string;
// }>();
</script>

<template>
  <div class="login">
    <div class="login-box">
      <h1 class="green">{{ msg }}</h1>
      Login gool!!! Login gool!!! Login gool!!!<br>Login gool!!! Login gool!!! Login gool!!!<br>
      Login gool!!! Login gool!!! Login gool!!!<br>Login gool!!! Login gool!!! Login gool!!!<br>
      Login gool!!! Login gool!!! Login gool!!!<br>Login gool!!! Login gool!!! Login gool!!!<br>
      Login gool!!! Login gool!!! Login gool!!!<br>Login gool!!! Login gool!!! Login gool!!!<br>
      Login gool!!! Login gool!!! Login gool!!!<br>Login gool!!! Login gool!!! Login gool!!!<br>
      Login gool!!! Login gool!!! Login gool!!!<br>Login gool!!! Login gool!!! Login gool!!!<br>
      Login gool!!! Login gool!!! Login gool!!!<br>Login gool!!! Login gool!!! Login gool!!!<br>
      Login gool!!! Login gool!!! Login gool!!!<br>Login gool!!! Login gool!!! Login gool!!!<br>
      Login gool!!! Login gool!!! Login gool!!!<br>Login gool!!! Login gool!!! Login gool!!!<br>
      Login gool!!! Login gool!!! Login gool!!!<br>Login gool!!! Login gool!!! Login gool!!!<br>
      JAAAAA
    </div>
  </div>
</template>

<style scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: 100vh;
  background: url("login-bg.png") no-repeat center center;
  width: 100%;
}

.login-box {
  background-color: var(--color-background);
  padding: 4rem;
  border-radius: 2rem;
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

body.darkmode .login:before {
  content: '';
  background-color: black;
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
