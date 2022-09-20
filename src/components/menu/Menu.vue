<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "Menu",
  props: ['menu', 'selectedItem', 'logout'],
  methods: {
    getIcon(item: any){
      return 'src/assets/icons/' + (item.icon ? item.icon : 'default') + '.svg';
    },

    isSvg(item: any){
      if( ! item.icon){
        return false;
      }

      return item.icon.substring(0, 1) == '<';
    },
  }
});
</script>

<script setup lang="ts">
import InlineSvg from 'vue-inline-svg';
</script>

<template>
  <ul>
    <li v-for="(item, key) in menu" :class="selectedItem === key ? 'selected' : ''">
      <router-link :to="key">
        <span v-if="isSvg(item)" v-html="item.icon"></span>
        <span v-else><inline-svg :src="getIcon(item)"/></span>
        {{ item.label }}
      </router-link>
      <ul v-if="item.submenu">
        <li v-for="(subitem, subkey) in item.submenu" :class="selectedItem === subkey ? 'selected' : ''">
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
        <span><inline-svg :src="$assets + 'icons/logout.svg'"/></span> Uitloggen
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

      &:hover {
        background-color: var(--main-color);
        color: var(--color-text-in-main-bg);

        :deep(svg), :deep(svg) * {
          fill: var(--color-text-in-main-bg);
        }
      }
    }

    &.selected > a {
      background-color: var(--main-color);
      color: var(--color-text-in-main-bg);

      :deep(svg), :deep(svg) * {
        fill: var(--color-text-in-main-bg);
      }
    }

    ul {
      margin-left: 20px;
      margin-top: 3px;

      a {
        font-size: small;
        line-height: 18px;

        :deep(svg) {
          top: 0;
        }
      }
    }
  }
}
</style>