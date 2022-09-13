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
      dataTable: {},
      selectedMenuItem: '',
      html: '',
      assets: this.assets,
    }
  },
  mounted() {
    homeMock.mock();
    this.checkLogin();

    if (this.$route) {
      let module = this.$route.params.module;

      if (module) {
        this.loadModule(String(module));
      }
    }
  },
  methods: {
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
    setContentByResponseData(data: any)
    {
      this.html = data.html;
      this.dataTable = data.dataTable;
    }
  }
});
</script>

<script setup lang="ts">
import Logo from "@/components/icons/Logo.vue";
import Menu from "@/components/menu/Menu.vue";
import DataTable from "@/components/datatable/DataTable.vue";
</script>

<template>
  <div class="sidebar">
    <div class="sidebar__logo">
      <Logo/>
    </div>
    <div class="sidebar__menu">

      <Menu :menu="menu" :selectedItem="selectedMenuItem" :logout="logout"/>
    </div>
  </div>
  <div class="main">
    <span v-if="html" v-html="html"></span>
    <DataTable v-if="dataTable" :settings="dataTable" />
  </div>
</template>

<style lang="scss" scoped>
$sideBarWidth: 250px;
$mainPadding: 40px;

.sidebar {
  width: $sideBarWidth;
  padding: $mainPadding;
  position: fixed;
  background-color: var(--color-background-shade1);
  height: 100%;
  overflow: auto;
  z-index: 1;
  transition: background-color .5s;

  &__logo {
    margin-bottom: $mainPadding;
  }

  &__menu {
    position: relative;
  }
}

.main {
  padding: $mainPadding $mainPadding $mainPadding $mainPadding + $sideBarWidth;
}
</style>