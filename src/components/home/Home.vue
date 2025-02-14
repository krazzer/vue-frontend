<script lang="ts">
import {defineAsyncComponent, defineComponent, markRaw} from 'vue'
import Logo from "@/components/icons/Logo.vue";
import Loader from "@/components/icons/Loader.vue";
import Form from "@/components/form/Form.vue";
import Menu from "@/components/menu/Menu.vue";
import DataTable from "@/components/datatable/DataTable.vue";
import Media from "@/components/media/Media.vue";
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
    },
    async component(value) {
      if (!value) {
        return;
      }

      const componentPath = '../../../plugins/' + value + '.vue';
      const components    = import.meta.glob('../../../plugins/**/*.vue');

      if (components[componentPath]) {
        this.customComponent = markRaw(defineAsyncComponent(() => import(/* @vite-ignore */ componentPath)));
      } else {
        this.html            = `Component "${value}.vue" not found`;
        this.customComponent = null;
      }
    },
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
      fatalError: '',
      customComponent: null,
      isLoaded: false,
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
          this.isLoaded = true;
        }
      }, {
        onError: (error: any) => {
          this.fatalError = error.message;
        }
      });
    },

    /**
     * @param data
     */
    setContentByResponseData(data: any) {
      this.customComponent = null;
      this.html            = data.html;
      this.dataTable       = data.dataTable;
      this.media           = data.media;
      this.component       = data.component;
      this.form            = data.form;
    },

    toggleMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen;
    },

    closeMenu() {
      this.mobileMenuOpen = false;
    },
  },
});
</script>

<template>
  <div v-if="!isLoaded && $appUtil.isBusyLoading()" class="main-loader">
    <Loader/>
  </div>
  <div v-if="fatalError" class="fatal-error">
    {{ fatalError }}
  </div>
  <div v-if="isLoaded" id="cms" :class="{ open: mobileMenuOpen, noselect: $appUtil.isPreventSelect() }">
    <div class="sidebar-close-button" @click="toggleMenu">
      <i data-v-be8dafae="" class="mdi mdi-close"></i>
    </div>
    <div class="sidebar">
      <div class="sidebar__logo">
        <Logo/>
      </div>
      <div class="sidebar__loader" v-if="$appUtil.isBusyLoading()">
        <Loader/>
        {{ $translator.tl('general.loading') }}
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
      <DataTable v-if="dataTable" :settings="dataTable" :instance="dataTable.instance" :darkMode="darkMode" :level="0"/>
      <TabbedForm v-if="form" :form="form" :data="form.data" :handleSubmit="true"/>
      <component v-if="customComponent" :is="customComponent"/>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$sideBarWidth: 250px;
$mainPadding: 40px;
$mainPaddingMobile: 20px;
$sideBarWidthMobile: 200px;

#cms {
  &.noselect {
    @include noSelect();
  }

  &.open {
    .sidebar {
      margin-left: 0;
    }

    .sidebar-close-button {
      margin-left: 0;
    }
  }
}

.fatal-error, .main-loader{
  padding: 40px 20px;
  text-align: center;
  color: var(--color-text-gray);
  font-size: 20px;
}

.main-loader :deep(svg){
  width: 30px;
}

.sidebar-close-button {
  position: fixed;
  left: calc($sideBarWidth - 25px);
  margin-left: -$sideBarWidth;
  top: 8px;
  z-index: 2;
  cursor: pointer;
  transition: margin-left .3s;
  font-size: $closeButtonSize;
  display: none;

  @media (max-width: $screen-sm-max) {
    left: calc($sideBarWidthMobile - 45px);
    margin-left: -$sideBarWidthMobile;
    display: block;
  }
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

    svg {
      height: 23px;
      margin-right: 2px;
    }
  }

  @media (max-width: $screen-sm-max) {
    width: $sideBarWidthMobile;
    margin-left: -$sideBarWidthMobile;
    padding: $mainPaddingMobile;

    .sidebar__logo {
      display: none;
    }
  }
}

.main {
  padding: $mainPadding $mainPadding $mainPadding $mainPadding + $sideBarWidth;

  > :deep(.v-tabs) {
    margin-bottom: $spaceLogoMenu - $spaceExtraTab;
  }

  @media (max-width: $screen-sm-max) {
    padding: $mainPaddingMobile;
  }
}

.menu-button {
  position: relative;
  width: 36px;
  height: 20px;
  transform: rotate(0deg);
  transition: margin-left .3s;
  cursor: pointer;
  margin-bottom: $tableRowHeight;
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