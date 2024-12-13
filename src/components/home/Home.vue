<script lang="ts">
import {defineComponent} from 'vue'
import Logo from "@/components/icons/Logo.vue";
import Loader from "@/components/icons/Loader.vue";
import Menu from "@/components/menu/Menu.vue";
import DataTable from "@/components/datatable/DataTable.vue";
import Media from "@/components/media/Media.vue";
import Form from "@/components/form/Form.vue";
import TabbedForm from "@/components/form/TabbedForm.vue";

export default defineComponent({
  components: {TabbedForm, Logo, Loader, Menu, DataTable, Media, Form},
  props: ['darkMode'],
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
      form: <any>{},
      dataTable: <any>{},
      media: {},
      selectedMenuItem: '',
      html: '',
      component: '',
      mobileMenuOpen: false,
      role: '',
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
      this.$appUtil.doAction('default-module', {}, (response: any) => {
        this.setContentByResponseData(response.data);
      });
    },
    loadModule(module: string) {
      this.$appUtil.doAction('module/' + module, {}, (response: any) => {
        this.selectedMenuItem = module;
        this.setContentByResponseData(response.data);
      });
    },
    logout() {
      this.$appUtil.doAction('logout', {}, () => this.checkLogin());
    },

    checkLogin() {
      this.$appUtil.doAction('home', {}, (response: any) => {
        if (!response.data.loggedIn) {
          this.$router.push({name: 'login'});
        } else {
          this.menu = response.data.menu;
          this.role = response.data.role;

          if (!this.selectedMenuItem) {
            this.selectedMenuItem = response.data.selectedMenuItem;
          }

          this.setContentByResponseData(response.data);
        }
      });
    },

    /**
     * @param data
     */
    setContentByResponseData(data: any) {
      this.html      = data.html;
      this.dataTable = data.dataTable;
      this.media     = data.media;
      this.component = data.component;
      this.form      = data.form;
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
      <div class="sidebar__loader" v-if="$appUtil.isLoading()">
        <Loader /> {{ $translator.tl('general.loading') }}
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
      <Media v-if="media && Object.keys(media).length" :settings="media" :role="role"/>
      <DataTable v-if="dataTable" :settings="dataTable" :instance="dataTable.instance" :darkMode="darkMode" :level="0" />
      <TabbedForm v-if="form" :form="form" :data="form.data" @submit=""/>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/media-query-sizes.scss";
@import "@/assets/base.scss";

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

  // logo height = 39px
  &__logo {
    margin-top: -4px;
  }

  &__menu {
    position: relative;
    margin-top: $spaceLogoMenu - 5px;
  }

  &__loader {
    position: absolute;
    border-radius: var(--border-radius);
    width: $sideBarWidth - ($mainPadding * 2);
    margin-top: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12.5px;

    svg{
      height: 23px;
      margin-right: 2px;
    }
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

  > :deep(.v-tabs) {
    margin-bottom: $spaceLogoMenu - $spaceExtraTab;
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

:deep(.tox-tinymce-aux) {
  z-index: 2500;
}
</style>