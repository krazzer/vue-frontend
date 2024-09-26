<script lang="ts">
import Page from "./Page.vue";
import Svg from "@/components/svg/Svg.vue";
import {defineComponent} from "vue";

export default defineComponent({
  components: {Page, Svg},
  emits: ['collapse', 'edit', 'toggle'],
  name: "Row",
  props: ['row', 'dragAndDropPages', 'headers', 'settings', 'id', 'level', 'selected', 'selectedIds', 'max',
    'highlight', 'actions', 'index'],
  data() {
    return {
      preventSelect: <boolean>false,
    };
  },
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

    arrowClick(event: MouseEvent) {
      event.stopPropagation();
      this.row.collapsed = !this.row.collapsed;
      this.$emit('collapse', this.row.id, this.row.collapsed, this.index);
    },

    /**
     * @param row
     * @param iconKey
     * @param event
     */
    clickAction(row: any, iconKey: string, event: MouseEvent){
      event.stopPropagation();

      if(row.actionUrls && row.actionUrls[iconKey]){
        window.open(row.actionUrls[iconKey]);
      }
    },

    /**
     * @param event
     */
    toggleRow(event: MouseEvent) {
      this.$emit('toggle', this.id, !this.selected, this.index, event);
    },

    /**
     * Prevents text selection when performing a double click
     * @param event
     */
    mousedown(event: MouseEvent) {
      if (event.detail > 1) {
        event.preventDefault();
      }
    },

    getCell(cell: string){
      if( ! cell){
        return '&nbsp;';
      }

      if(this.highlight){
        let regexp = new RegExp(String.raw`${this.highlight}`, "gi");

        cell = cell.replace(regexp, (match) => {
          return `<span class="highlighted">${match}</span>`;
        });
      }

      return cell;
    },

    getClasses(){
      let classes = [];

      if(this.selected){
        classes.push('selected');
      }

      if(this.preventSelect){
        classes.push('preventselect');
      }

      return classes;
    },

    /**
     * @param id
     */
    isSelected(id: string): boolean{
      return this.selectedIds.includes(id);
    }
  }
});
</script>

<template>
  <tr @click="toggleRow" :class="getClasses()" @mousedown="mousedown($event)" @dblclick="$emit('edit', row.id, $event)">
    <td v-for="(cell, i) in row.data" :data-column="headers[i]" @mouseleave="dragAndDropPages.mouseLeave"
        @mouseenter="dragAndDropPages.mouseEnter(row.id, $event)"
        @mousemove="dragAndDropPages.mouseMoveContainer(row.id, $event, max, level)">
      <template v-if="getCellType(i) == 'page'">
        <Page v-if="dragAndDropPages.itemIdMouseDown == row.id" :cell="cell" :cloned="true" :level="row.level"
              @startDrag="dragAndDropPages.setMouseDown(row.id, $event)" :x="dragAndDropPages.itemX"
              :y="dragAndDropPages.itemY" :type="row.type" :hasCildren="row.children" :collapse="row.collapsed"
              @arrowClick="arrowClick($event)"/>
        <Page :cell="cell" :id="row.id" :key="row.id" :dragAndDropPages="dragAndDropPages"
              :isDragged="dragAndDropPages.isDragged(row.id)" :level="row.level" ref="pages"
              @startDrag="dragAndDropPages.setMouseDown(row.id, $event)" :type="row.type"
              :hasCildren="row.children" :collapse="row.collapsed" @arrowClick="arrowClick($event)"/>
      </template>
      <template v-else><span v-html="getCell(cell)" /></template>
      <template v-if="i == row.data.length - 1">
        <div class="buttons">
          <span v-for="action in actions" @click="clickAction(row, action.key, $event)"><i :class="'mdi ' + action.icon"></i></span>
          <span @click="$emit('edit', row.id, $event)"><i class="mdi mdi-square-edit-outline"></i>
          </span>
        </div>
      </template>
    </td>
  </tr>
</template>

<style lang="scss" scoped>
@import "./../styles/pages";

:deep(.highlighted){
  background-color: var(--color-action);
  color: var(--color-text-in-main-bg);
}

tr.selected td{
  background-color: var(--main-color);
  color: var(--color-text-in-main-bg);

  :deep(svg) {
    path {
      fill: var(--color-text-in-main-bg);
    }
  }

  :deep(.name) {
    color: var(--color-text)
  }
}

tr:hover td .buttons {
  display: inline-block;
}

td .buttons {
  display: none;
  position: absolute;
  right: 15px;
  top: 0;
  padding: 4px 0;

  span{
    cursor: pointer;
    margin-left: 6px;
  }

  i{
    font-size: 20px;
  }
}
</style>