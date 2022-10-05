<script lang="ts">
import {defineComponent} from "vue";

const modules = import.meta.glob('@/assets/icons/*.svg', {as: 'raw'});

export default defineComponent({
  name: "Menu",
  props: ['menu', 'selectedItem', 'logout'],
  methods: {
    getIcon(item: any) {
      let defaultIcon = '';

      for (const key in modules) {
        const name = key.split('/').reverse()[0].split('.')[0];

        if(name == item.icon){
          return modules[key];
        }

        if(name == 'default'){
          defaultIcon = String(modules[key]);
        }
      }

      return defaultIcon;
    },

    isSvg(item: any) {
      if (!item.icon) {
        return false;
      }

      return item.icon.substring(0, 1) == '<';
    },
    isSelected(item: any, key: any): boolean {
      return this.selectedItem === key || (item.submenu && this.selectedItem in item.submenu);
    }
  }
});
</script>

<template>
  <ul>
    <li v-for="(item, key) in menu" :class="isSelected(item, key) ? 'selected' : ''">
      <router-link :to="key">
        <span v-if="isSvg(item)" v-html="item.icon"></span>
        <span v-else v-html="getIcon(item)"></span>
        {{ item.label }}
      </router-link>
      <ul v-if="item.submenu" :data-count="Object.keys(item.submenu).length">
        <li v-for="(subitem, subkey) in item.submenu" :class="selectedItem === subkey ? 'selected' : ''">
          <router-link :to="subkey">
            <span v-if="isSvg(subitem)" v-html="subitem.icon"></span>
            <span v-else v-html="getIcon(subitem)"></span>
            {{ subitem.label }}
          </router-link>
        </li>
      </ul>
    </li>
    <li>
      <a href="javascript:void(0)" @click="logout">
        <span v-html="getIcon({icon: 'logout'})"></span> Uitloggen
      </a>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
ul {
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    margin-bottom: 3px;

    a {
      color: var(--color-text);
      display: block;
      padding: 9px 10px 11px 35px;
      border-radius: var(--border-radius);
      line-height: 19px;

      :deep(svg) {
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
    }

    ul {
      max-height: 0;
      background-color: var(--color-background-shade2);
      border-radius: var(--border-radius);
      transition: max-height .5s;
      overflow: hidden;

      li {
        margin-bottom: 2px;

        &.selected > a, > a:hover {
          background-color: var(--color-background-shade3);
        }

        &:first-child {
          margin-top: 2px;
        }
      }

      a {
        font-size: small;
        line-height: 18px;

        :deep(svg) {
          top: 1px;
          left: -23px;
          width: 15px;
          height: 15px;
        }
      }
    }
  }
}

ul:first-child > li {
  &.selected > a, > a:hover {
    background-color: var(--main-color);
    color: var(--color-text-in-main-bg);

    :deep(svg), :deep(svg) * {
      fill: var(--color-text-in-main-bg);
    }
  }

  &.selected ul {
    @for $i from 1 through 20 {
      &[data-count="#{$i}"] {
        max-height: $i * 40px;
      }
    }
  }
}
</style>