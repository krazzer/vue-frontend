<script lang="ts">
import Page from "./Page.vue";
import Svg from "@/components/svg/Svg.vue";
import {defineComponent} from "vue";

export default defineComponent({
  components: {Page, Svg},
  emits: ['edit'],
  name: "Row",
  props: ['row', 'dragAndDropPages', 'headers', 'settings', 'id', 'level'],
  methods: {
    /**
     * @param index
     */
    getCellType(index: number): string | null {
      let cellSettings = this.getCellSettings(index);

      if (cellSettings && cellSettings.type) {
        return cellSettings.type;
      }

      return null;
    },

    /**
     * @param index
     */
    getCellSettings(index: number): any | null {
      let cellSettings = this.settings ? this.settings.cells : null;

      if (!cellSettings) {
        return null;
      }

      return cellSettings[this.settings.headers[index]];
    },
  }
});
</script>

<template>
  <tr>
    <td v-for="(cell, i) in row.data" :data-column="headers[i]" @mouseleave="dragAndDropPages.mouseLeave"
        @mouseenter="dragAndDropPages.mouseEnter(row.id, $event)"
        @mousemove="dragAndDropPages.mouseMoveContainer(row.id, $event)">
      <template v-if="getCellType(i) == 'page'">
        <Page v-if="dragAndDropPages.itemIdMouseDown == row.id" :cell="cell" :cloned="true" :level="level"
              @startDrag="dragAndDropPages.setMouseDown(row.id, $event)" :x="dragAndDropPages.itemX"
              :y="dragAndDropPages.itemY" :type="row.type" />
        <Page :cell="cell" :id="row.id" :key="row.id" :dragAndDropPages="dragAndDropPages"
              :isDragged="dragAndDropPages.isDragged(row.id)" :level="level" ref="pages"
              @startDrag="dragAndDropPages.setMouseDown(row.id, $event)" :type="row.type" />
      </template>
      <template v-else>{{ cell ? cell : '&nbsp;' }}</template>
      <template v-if="i == row.data.length - 1">
        <div class="buttons">
          <span @click="$emit('edit', row.id)"><Svg :svg="'edit'"/></span>
        </div>
      </template>
    </td>
  </tr>
  <Row v-if="row.children" :dragAndDropPages="dragAndDropPages" :headers="headers" :settings="settings"
       @edit="$emit('edit' as any, row.id)" :id="row.id" :row="childRow" v-for="childRow in row.children"
       :level="level + 1"/>
</template>

<style lang="scss" scoped>
@import "./../styles/pages";

tr:hover td .buttons {
  display: inline-block;
}

td .buttons {
  display: none;
  position: absolute;
  right: 15px;
}

td .icon {
  width: 20px;
  display: inline-block;
  cursor: pointer;

  :deep(svg) {
    path {
      fill: var(--color-text);
    }
  }

  &--edit {
    margin-top: 2px;
  }
}

td .icon {
  width: 20px;
  display: inline-block;
  cursor: pointer;

  :deep(.icon) {
    display: inline-block;
  }

  :deep(svg) {
    path {
      fill: var(--color-text);
    }
  }

  &--edit {
    margin-top: 2px;
  }
}
</style>