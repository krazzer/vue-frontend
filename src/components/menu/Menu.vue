<script lang="ts">
import {defineComponent} from "vue";
import Svg from "@/components/svg/Svg.vue";

export default defineComponent({
  name: "Menu",
  components: {Svg},
  props: ['menu', 'selectedItem', 'logout', 'mobileMenuOpen'],
  methods: {
    isSelected(item: any, key: any): boolean {
      return this.selectedItem === key || (item.submenu && this.selectedItem in item.submenu);
    },

    openLink(key: string, hasSubItems: boolean = false) {
      if( ! this.mobileMenuOpen || ! hasSubItems){
        this.$emit('select')
      }

      this.$router.push(key);
    },

    hasSubItems(item: any): boolean {
      if( ! item.submenu){
        return false;
      }

      return Object.keys(item.submenu).length > 0;
    }
  }
});
</script>

<template>
  <ul>
    <li v-for="(item, key) in menu" :class="isSelected(item, key) ? 'selected' : ''">
      <a @click="openLink(key.toString(), hasSubItems(item))">
        <Svg :svg="item.icon" /> {{ item.label }}
      </a>
      <ul v-if="item.submenu" :data-count="Object.keys(item.submenu).length">
        <li v-for="(subitem, subkey) in item.submenu" :class="selectedItem === subkey ? 'selected' : ''">
          <a @click="openLink(subkey.toString())">
            <Svg :svg="subitem.icon" /> {{ subitem.label }}
          </a>
        </li>
      </ul>
    </li>
    <li v-if="Object.keys(menu).length">
      <a href="javascript:void(0)" @click="logout">
        <Svg svg="logout" /> Uitloggen
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
    padding: 1px 0;

    a {
      cursor: pointer;
      color: var(--color-text);
      display: block;
      padding: 9px 10px 10px 35px;
      border-radius: var(--border-radius);
      line-height: 19px;

      span{
        position: relative;
      }

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
        &.selected > a, > a:hover {
          background-color: var(--color-background-shade3);
        }

        &:first-child {
          margin-top: 1px;
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