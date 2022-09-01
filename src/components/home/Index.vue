<script lang="ts">
import {defineComponent} from 'vue'
import axios from "axios";
import homeMock from "./classes/mock";

export default defineComponent({
  data() {
    return {
      menu: {},
      selectedMenuItem: '',
    }
  },
  mounted() {
    homeMock.mock();
    this.checkLogin();
  },
  methods: {
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
              this.selectedMenuItem = 'pages';
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
          <a href="javascript:void(0)">
            <span v-if="isSvg(item)" v-html="item.icon"></span>
            <span v-else><inline-svg :src="getIcon(item)"/></span>
            {{ item.label }}
          </a>
          <ul v-if="item.submenu">
            <li v-for="(subitem, subkey) in item.submenu" :class="selectedMenuItem === subkey ? 'selected' : ''">
              <a href="javascript:void(0)">
                <span v-if="isSvg(subitem)" v-html="subitem.icon"></span>
                <span v-else><inline-svg :src="getIcon(subitem)"/></span>
                {{ subitem.label }}
              </a>
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
              top: 0;
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

          &.selected a{
            background-color: var(--main-color);
            color: var(--color-text-in-main-bg);

            :deep(svg), :deep(svg) *{
              fill: var(--color-text-in-main-bg);
            }
          }

          ul{
            margin-left: 20px;

            a{
              font-size: small;
              line-height: 18px;
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