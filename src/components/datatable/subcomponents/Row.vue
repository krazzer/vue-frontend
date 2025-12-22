<script lang="ts">
import {defineComponent} from "vue";
import Page from "./Page.vue";
import Svg from "@/components/svg/Svg.vue";
import DragAndDropRow from "@/mixins/DragAndDropRow.vue";

export default defineComponent({
  components: {Page, Svg},
  emits: ['collapse', 'edit', 'toggle'],
  name: "Row",
  props: ['row', 'dragAndDropPages', 'headers', 'settings', 'id', 'level', 'selected', 'selectedIds', 'max',
    'highlight', 'actions', 'index', 'forceDefaultView', 'mobileColumns', 'dragClone', 'cloneRowVisible', 'instance',
    'busyCollapsing', 'justEdited', 'justEditedFading'],
  mixins: [DragAndDropRow],
  data() {
    return {
      preventSelect: <boolean>false,
      mouseX: <number>0,
      mouseY: <number>0,
      data: <any>{},
    };
  },
  watch: {
    row: {
      handler: 'handleRowChange',
      deep: true
    },
    mouseDownRearrange() {
      this.preventSelect = this.mouseDownRearrange;
    },
  },
  mounted() {
    this.data = this.row.data;
    window.addEventListener("mousemove", this.onMouseMove);
  },
  beforeUnmount() {
    window.removeEventListener("mousemove", this.onMouseMove);
  },
  methods: {
    displayAsPage(index: number): boolean {
      let isPage = this.getCellType(index) == 'page';

      if (this.forceDefaultView) {
        return false;
      }

      return isPage;
    },

    handleRowChange() {
      this.data = this.row.data;
    },

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

      let key = this.getCellKey(index);

      return cellSettings[key];
    },

    getCellKey(index: number): string {
      return <any> Object.keys(this.headers)[index];
    },

    arrowClick(event: MouseEvent) {
      event.stopPropagation();

      if (this.busyCollapsing) {
        return;
      }

      this.row.collapsed = !this.row.collapsed;
      this.$emit('collapse', this.row.id, this.row.collapsed, this.index);
    },

    /**
     * @param row
     * @param iconKey
     * @param event
     */
    clickAction(row: any, iconKey: string, event: MouseEvent) {
      event.stopPropagation();

      if (row.actionUrls && row.actionUrls[iconKey]) {
        window.open(row.actionUrls[iconKey]);
      }
    },

    onMouseMove(event: MouseEvent) {
      this.mouseX = event.clientX;
      this.mouseY = event.clientY;
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

    getActionClass(action: any) {
      let classes = [];

      if (action.type == 'rearrange') {
        classes.push('rearrange');

        if (this.mouseDownRearrange) {
          classes.push('mousedown');
        }
      }

      return classes;
    },

    getCell(cell: string) {
      if (!cell) {
        return '&nbsp;';
      }

      if (this.highlight) {
        let regexp = new RegExp(String.raw`${this.highlight}`, "gi");

        cell = cell.replace(regexp, (match) => {
          return `<span class="highlighted">${match}</span>`;
        });
      }

      return cell;
    },

    getClasses() {
      let classes = [];

      if (this.selected) {
        classes.push('selected');
      }

      if (this.preventSelect) {
        classes.push('preventselect');
      }

      if (this.dragClone) {
        classes.push('dragclone');
      }

      if (this.cloneRowVisible) {
        classes.push('visible');
      }

      if (this.mouseDownRearrange) {
        classes.push('mouseDownRearrange');
      }

      if (this.justEdited) {
        classes.push('justEdited');
      }

      if (this.justEditedFading) {
        classes.push('justEditedFading');
      }

      return classes;
    },

    /**
     * @return string
     */
    getFloatingPreviewStyle(): string {
      return 'left:' + (this.mouseX + 20) + 'px; top: ' + (this.mouseY + 20) + 'px'
    },

    /**
     * @param index
     */
    getKey(index: number): string {
      return <any> Object.keys(this.headers)[index];
    },

    /**
     * @param index
     */
    getTdClass(index: number): Array<string> {
      let key     = this.getKey(index);
      let classes = [];

      if (this.mobileColumns.includes(key)) {
        classes.push('mobile');
      }

      if (this.getCellType(index) == 'image') {
        classes.push('image');
      }

      if (this.getCellType(index) == 'page') {
        classes.push('page');
      }

      return classes;
    },

    /**
     * @param id
     */
    isSelected(id: string): boolean {
      return this.selectedIds.includes(id);
    },

    /**
     * @param id
     * @param i
     */
    async changeCheckbox(id: string, i: number) {
      let key   = this.getCellKey(i);
      let value = this.data[i];

      await this.$appUtil.doAction('datatable/check', {
        instance: this.instance, field: key, id: parseInt(id), value: this.data[i]
      }, () => {
        this.data[i] = value;
      });
    },
  }
});
</script>

<template>
  <tr @click="toggleRow" :class="getClasses()" @mousedown="mousedown($event)" @dblclick="$emit('edit', row.id, $event)"
      :data-id="row.id">
    <td v-for="(cell, i) in row.data" :data-column="getKey(i)" @mouseleave="dragAndDropPages.mouseLeave"
        @mouseenter="dragAndDropPages.mouseEnter(row.id, $event)" :class="getTdClass(i)"
        @mousemove="dragAndDropPages.mouseMoveContainer(row.id, $event, max, level)">
      <template v-if="displayAsPage(i)">
        <Page v-if="dragAndDropPages.itemIdMouseDown == row.id" :cell="cell" :cloned="true" :level="row.level"
              @startDrag="dragAndDropPages.setMouseDown(row.id, $event)" :x="dragAndDropPages.itemX"
              :y="dragAndDropPages.itemY" :type="row.type" :hasCildren="row.children" :collapse="row.collapsed"
              @arrowClick="arrowClick($event)"/>
        <Page :cell="cell" :id="row.id" :key="row.id" :dragAndDropPages="dragAndDropPages"
              :isDragged="dragAndDropPages.isDragged(row.id)" :level="row.level" ref="pages"
              @startDrag="dragAndDropPages.setMouseDown(row.id, $event)" :type="row.type"
              :hasCildren="row.children" :collapse="row.collapsed" @arrowClick="arrowClick($event)"/>
      </template>
      <template v-else-if="getCellType(i) == 'image'">
        <a target="_blank" :href="getCell(cell)" @click="(e) => e.stopPropagation()">
          <img class="preview" :src="getCell(cell)" alt=""/>
        </a>
        <img class="floating-preview" :style="getFloatingPreviewStyle()" :src="getCell(cell)" alt=""/>
      </template>
      <template v-else-if="getCellType(i) == 'checkbox'">
        <v-checkbox v-model="data[i]" @change="changeCheckbox(row.id, i)"
                    @dblclick="(e: any) => e.stopPropagation()" @click="(e: any) => e.stopPropagation()"/>
      </template>
      <template v-else><span v-html="getCell(cell)"/></template>
      <template v-if="i == row.data.length - 1">
        <div class="buttons">
          <span v-for="action in actions" @click="clickAction(row, action.key, $event)"
                @mousedown="actionMouseDown(row, action, $event)" :class="getActionClass(action)">
            <i :class="'mdi ' + action.icon"></i>
          </span>
          <span @click="$emit('edit', row.id, $event)"><i class="mdi mdi-square-edit-outline"></i>
          </span>
        </div>
      </template>
    </td>
    <td class="button-column">
      <div class="buttons">
          <span v-for="action in actions" @click="clickAction(row, action.key, $event)"
                @mousedown="actionMouseDown(row, action, $event)" :class="getActionClass(action)">
            <i :class="'mdi ' + action.icon"></i></span>
        <span @click="$emit('edit', row.id, $event)"><i class="mdi mdi-square-edit-outline"></i>
          </span>
      </div>
    </td>
  </tr>
</template>

<style lang="scss" scoped>
@use "./../styles/pages";

tr.dragclone {
  display: none;
  position: absolute;
  width: 100%;
  top: 0;
  opacity: 1;
  border-top: 1px solid var(--color-background-shade3);
  border-bottom: 1px solid var(--color-background-shade3);

  td {
    background-color: var(--color-background-shade1-opaque);
  }

  &.visible {
    display: flex;
  }
}

tr.rearrange {
  &--bottom {
    td {
      position: relative;
      top: 2px;
      border-bottom: 4px solid var(--color-action);
      padding-top: $tableRowTopPadding - 2px !important;
      padding-bottom: $tableRowTopPadding - 2px !important;
    }
  }

  &--top td {
    position: relative;
    top: -2px;
    border-top: 4px solid var(--color-action);
    padding-top: $tableRowTopPadding - 2px !important;
    padding-bottom: $tableRowTopPadding - 2px !important;
  }
}

:deep(.mdi:before) {
  line-height: 20px;
}

:deep(.highlighted) {
  background-color: var(--color-action);
  color: var(--color-text-in-main-bg);
}

tr.justEditedFading td {
  transition: background-color 1s;
}

tr.justEdited td {
  background-color: var(--color-edited);
}

tr.selected td {
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

tr.selected:hover:not(.mouseDownRearrange) td .buttons {
  background-color: var(--main-color);
}

@media (min-width: $screen-md-min) {
  tr:hover:not(.mouseDownRearrange) td .buttons {
    display: flex;
    background-color: var(--color-background-shade2);
  }
}

@media (max-width: $screen-sm-max) {
  td {
    display: none;

    &.mobile {
      display: table-cell;
    }
  }
}

td .buttons {
  display: none;
  position: absolute;
  right: 15px;
  top: 0;
  height: 100%;
  white-space: nowrap;
  gap: 8px;
  align-items: center;

  span {
    cursor: pointer;
  }

  i {
    font-size: 20px;
  }

  .rearrange {
    cursor: grab;

    &.mousedown {
      cursor: grabbing;
    }
  }
}

td .v-checkbox {
  position: absolute;
  top: 0;
  left: 3px;
  display: flex;
  justify-content: center;
  height: 100%;

  :deep(.v-selection-control) {
    min-height: auto;
  }
}

td.button-column {
  display: none;

  @media (max-width: $screen-sm-max) {
    display: table-cell;

    .buttons {
      display: flex;
      position: static;
      height: 22px;
      top: 0;
    }
  }
}

.datatable__table table td.image {
  padding: 2px 0;

  a {
    cursor: zoom-in;
    vertical-align: top;
    display: inline-block;
  }

  .preview {
    display: block;
    height: calc($tableRowHeight - 4px);
    border-radius: var(--border-radius);
  }

  .floating-preview {
    position: fixed;
    max-width: 200px;
    max-height: 200px;
    pointer-events: none;
    display: none;
    z-index: 1;
    border-radius: var(--border-radius);
  }

  &:hover .floating-preview {
    display: block;
  }
}
</style>