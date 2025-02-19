<script setup>
import Logo from "@/components/icons/Logo.vue";
</script>
<template>
  <div class="login">
    <div class="login-box">
      <div class="login-box__logo">
        <Logo/>
      </div>
      <slot/>
    </div>
  </div>
</template>

<style lang="scss" scoped>

:deep(.v-alert) {
  margin-top: 10px;
}

:deep(.v-form) {
  margin-bottom: 10px;
}

:deep(.v-input__details){
  padding-bottom: 4px;
  padding-top: 0;
}

.login {
  background: url("@/assets/login-background.jpg") no-repeat center center fixed;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: 100vh;
  width: 100%;

  &:before {
    content: '';
    background-color: white;
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: .5;
    z-index: 0;
  }
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
  z-index: 1;

  &__logo {
    margin-bottom: 2rem;

    svg {
      width: 200px;
      display: block;
      margin: 0 auto;
    }
  }

  @media (max-width: 500px) {
    width: 100%;
    padding: 2rem;

    &__logo {
      margin-bottom: 2rem;

      svg {
        width: 175px;
      }
    }
  }
}

body.transition .login:before {
  transition: background-color var(--color-scheme-transition-speed), opacity var(--color-scheme-transition-speed);
}

body.darkmode .login:before {
  background-color: black;
  opacity: .6;
}
</style>
