<script lang="ts">
import {defineComponent} from 'vue'
import axios from "axios";
import Logo from "@/components/icons/Logo.vue";
import Menu from "@/components/menu/Menu.vue";
import DataTable from "@/components/datatable/DataTable.vue";
import Media from "@/components/media/Media.vue";

export default defineComponent({
  components: {Logo, Menu, DataTable, Media},
  watch: {
    $route() {
      let module = this.$route.params.module;

      if (module && typeof module != undefined) {
        this.loadModule(String(module));
      }
    }
  },
  data() {
    return {
      menu: {},
      dataTable: <any>{},
      media: {},
      selectedMenuItem: '',
      html: '',
      component: '',
      mobileMenuOpen: false,
    }
  },
  mounted() {
    this.checkLogin();

    if (this.$route) {
      let module = this.$route.params.module;

      if (module && typeof module != undefined) {
        this.loadModule(String(module));
      } else {
        this.loadDefaultModule();
      }
    }
  },
  methods: {
    loadDefaultModule() {
      axios
          .get('/api/default-module', {params: {}})
          .then(response => {
            console.log(response);
            // this.selectedMenuItem = response.module;
            this.setContentByResponseData(response.data);
          }).catch(error => {
            console.error(error);
          }
      );
    },
    loadModule(module: string) {
      this.selectedMenuItem = module;

      axios
          .get('/api/module/' + module, {params: {}})
          .then(response => {
            this.setContentByResponseData(response.data);
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

    checkLogin() {
      axios
          .get('/api/home', {params: {}})
          .then(response => {
            if (!response.data.loggedIn) {
              this.$router.push({name: 'login'});
            } else {
              this.menu = response.data.menu;

              if (!this.selectedMenuItem) {
                this.selectedMenuItem = response.data.selectedMenuItem;
              }

              this.setContentByResponseData(response.data);
            }
          }).catch(error => {
            console.error(error);
          }
      );
    },

    /**
     * @param data
     */
    setContentByResponseData(data: any) {
      this.html      = data.html;
      this.dataTable = data.dataTable;
      this.media     = data.media;
      this.component = data.component;
    },

    toggleMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen;
    },

    closeMenu() {
      this.mobileMenuOpen = false;
    }
  }
});
</script>

<template>
  <div id="cms" :class="{ open: mobileMenuOpen }">
    <div class="sidebar-close-button" @click="toggleMenu">╳</div>
    <div class="sidebar">
      <div class="sidebar__logo">
        <Logo/>
      </div>
      <div class="sidebar__menu">
        <Menu :menu="menu" :mobileMenuOpen="mobileMenuOpen" :selectedItem="selectedMenuItem" :logout="logout"
              @select="closeMenu"/>
      </div>
    </div>
    <div class="main">
      <div class="menu-button" @click="toggleMenu">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <span v-if="html" v-html="html"></span>
      <Media v-if="media && Object.keys(media).length" :settings="media"/>
      <DataTable v-if="dataTable" :settings="dataTable" :instance="dataTable.instance"/>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/media-query-sizes.scss";

$sideBarWidth: 250px;
$mainPadding: 40px;

#cms.open {
  .sidebar {
    margin-left: 0;
  }

  .sidebar-close-button {
    margin-left: 0;
  }
}

.sidebar-close-button {
  position: fixed;
  left: calc($sideBarWidth - 25px);
  margin-left: -$sideBarWidth;
  top: 3px;
  z-index: 2;
  cursor: pointer;
  transition: margin-left .3s;
}

.sidebar {
  width: $sideBarWidth;
  padding: $mainPadding;
  position: fixed;
  background-color: var(--color-background-shade1);
  height: 100%;
  overflow: auto;
  z-index: 1;
  transition: background-color var(--color-scheme-transition-speed), margin-left .3s;

  &__logo {
    margin-top: -3px;
    margin-bottom: $mainPadding + 3px;
  }

  &__menu {
    position: relative;
  }

  @media (max-width: $screen-sm-max) {
    margin-left: -$sideBarWidth;

    .sidebar__logo {
      display: none;
    }
  }
}

.main {
  padding: $mainPadding $mainPadding $mainPadding $mainPadding + $sideBarWidth;

  @media (max-width: $screen-sm-max) {
    padding-left: $mainPadding;
  }
}

.menu-button {
  position: relative;
  width: 36px;
  height: 20px;
  transform: rotate(0deg);
  transition: margin-left .3s;
  cursor: pointer;
  margin-bottom: 40px;
  display: none;

  span {
    display: block;
    position: absolute;
    height: 3px;
    width: 100%;
    background: var(--color-text);
    opacity: 1;
    left: 0;
    transform: rotate(0deg);
    transition: .25s ease-in-out;

    &:nth-child(1) {
      top: 0;
      transform-origin: left center;
    }

    &:nth-child(2) {
      top: 10px;
      transform-origin: left center;
    }

    &:nth-child(3) {
      top: 20px;
      transform-origin: left center;
    }
  }

  @media (max-width: $screen-sm-max) {
    display: block;
  }
}
</style>