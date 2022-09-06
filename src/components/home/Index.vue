<script lang="ts">
import {defineComponent} from 'vue'
import axios from "axios";
import homeMock from "./classes/mock";

export default defineComponent({
  watch: {
    $route(to) {
      this.loadModule(to.params.module);
    }
  },
  data() {
    return {
      menu: {},
      selectedMenuItem: '',
      html: '',
    }
  },
  mounted() {
    homeMock.mock();
    this.checkLogin();

    let module = this.$route.params.module;

    if(module) {
      this.loadModule(String(module));
    }
  },
  methods: {
    loadModule(module: string) {
      console.log(module);
      this.selectedMenuItem = module;

      axios
          .get('/api/module/' + module, {params: {}})
          .then(response => {
            if(response.data.html){
              this.html = response.data.html;
            }
          }).catch(error => {
            console.error(error);
          }
      );
    },
    logout() {
      axios
          .get('/api/logout', {params: {}})
          .then(() => {
            this.checkLogin();
          }).catch(error => {
            console.error(error);
          }
      );
    },

    checkLogin(){
      axios
          .get('/api/home', {params: {}})
          .then(response => {
            if (!response.data.loggedIn) {
              this.$router.push({name: 'login'});
            } else {
              this.menu = response.data.menu;
              this.selectedMenuItem = response.data.selectedMenuItem;

              if(response.data.html){
                this.html = response.data.html;
              }
            }
          }).catch(error => {
            console.error(error);
          }
      );
    },

    getIcon(item: any){
      return 'src/assets/icons/' + (item.icon ? item.icon : 'default') + '.svg';
    },

    isSvg(item: any){
      if( ! item.icon){
        return false;
      }

      return item.icon.substring(0, 1) == '<';
    }
  }
});
</script>

<script setup lang="ts">
  import Logo from "@/components/icons/Logo.vue";
  import InlineSvg from 'vue-inline-svg';
</script>

<template>
  <div class="sidebar">
    <div class="sidebar__logo">
      <Logo />
    </div>
    <div class="sidebar__menu">
      <ul>
        <li v-for="(item, key) in menu" :class="selectedMenuItem === key ? 'selected' : ''">
          <router-link :to="key">
            <span v-if="isSvg(item)" v-html="item.icon"></span>
            <span v-else><inline-svg :src="getIcon(item)"/></span>
            {{ item.label }}
          </router-link>
          <ul v-if="item.submenu">
            <li v-for="(subitem, subkey) in item.submenu" :class="selectedMenuItem === subkey ? 'selected' : ''">
              <router-link :to="subkey">
                <span v-if="isSvg(subitem)" v-html="subitem.icon"></span>
                <span v-else><inline-svg :src="getIcon(subitem)"/></span>
                {{ subitem.label }}
              </router-link>
            </li>
          </ul>
        </li>
        <li>
          <a href="javascript:void(0)" @click="logout">
            <span><inline-svg :src="'src/assets/icons/logout.svg'"/></span> Uitloggen
          </a>
        </li>
      </ul>
    </div>
  </div>
  <div class="main">
    <span v-html="html"></span>
  </div>
</template>

<style lang="scss" scoped>
  $sideBarWidth: 250px;
  $mainPadding: 40px;

  .sidebar{
    width: $sideBarWidth;
    padding: $mainPadding;
    position: fixed;
    background-color: var(--color-background-shade1);
    height: 100%;
    overflow: auto;
    z-index: 1;
    transition: background-color .5s;

    &__logo{
      margin-bottom: $mainPadding;
    }

    &__menu{
      position: relative;

      ul{
        list-style: none;
        padding: 0;
        margin: 0;

        li{
          margin-bottom: 3px;

          a{
            color: var(--color-text);
            display: block;
            padding: 9px 10px 11px 35px;
            border-radius: var(--border-radius);
            line-height: 19px;

            :deep(svg){
              width: 18px;
              height: 18px;
              fill: var(--color-text);
              position: absolute;
              top: 1px;
              left: -25px;
              margin-right: 2px;

              * {
                fill: var(--color-text);
              }
            }

            &:hover{
              background-color: var(--main-color);
              color: var(--color-text-in-main-bg);

              :deep(svg), :deep(svg) *{
                fill: var(--color-text-in-main-bg);
              }
            }
          }

          &.selected > a{
            background-color: var(--main-color);
            color: var(--color-text-in-main-bg);

            :deep(svg), :deep(svg) *{
              fill: var(--color-text-in-main-bg);
            }
          }

          ul{
            margin-left: 20px;
            margin-top: 3px;

            a{
              font-size: small;
              line-height: 18px;

              :deep(svg){
                top: 0;
              }
            }
          }
        }
      }
    }
  }

  .main{
    padding: $mainPadding $mainPadding $mainPadding $mainPadding + $sideBarWidth;
  }
</style>