<script lang="ts">
import {defineComponent, toRaw} from "vue";
import EditDialog from "./subcomponents/EditDialog.vue";
import Row from "./subcomponents/Row.vue";
import Svg from "@/components/svg/Svg.vue";
import DragAndDropPages from "./classes/dragAndDropPages";
import ToolbarSearch from "@/components/toolbarsearch/ToolbarSearch.vue";
import Toolbar from "@/mixins/Toolbar.vue";
import DragAndDropTable from "@/mixins/DragAndDropTable.vue";

export default defineComponent({
  name: "DataTable",
  components: {ToolbarSearch, Svg, EditDialog, Row},
  mixins: [Toolbar, DragAndDropTable],
  props: {
    darkMode: Boolean,
    settings: {
      type: Object,
      default() {
        return {}
      }
    },
    instance: String,
    level: Number,
  },
  data() {
    return {
      actions: <any>[],
      buttons: <any>[],
      filters: <any>[],
      filterValues: <any>{},
      filterValuesCompressed: <any>{},
      cloned: <number | null>null,
      data: <any>[],
      dialog: false,
      dialogEditId: <any>null,
      dragAndDropPages: DragAndDropPages,
      form: <any>[],
      editData: <any>[],
      error: '',
      language: <any>null,
      languages: <any>null,
      page: 1,
      headers: <any>[],
      mobileColumns: <any>[],
      highlight: '',
      pages: <any>[],
      search: '',
      sortKey: '',
      sortDirection: '',
      selected: <any>[],
      lastIndex: <number | null>null,
      noselect: false,
      forceDefaultView: false,
      saved: false,
    };
  },
  watch: {
    settings() {
      this.convertSettings(this.settings);
    },
    'dragAndDropPages.itemIdMouseDown'() {
      this.cloned = this.dragAndDropPages.itemIdMouseDown;
    },
    dialog() {
      if (!this.dialog) {
        this.saved = false;
      }
    },
    filterValues: {
      handler(values) {
        // prevent resize observer warning
        setTimeout(() => window.dispatchEvent(new Event('resize')));

        this.filterValuesCompressed = Object.fromEntries(
            Object.entries(toRaw(values)).map(([key, value]) => [key,
              Array.isArray(value) ? value.map(item => toRaw(item).key) : value ? toRaw(<any>value).key : null,
            ])
        );

        this.filter();
      },
      deep: true
    }
  },
  mounted() {
    if (Object.keys(this.settings).length !== 0) {
      this.convertSettings(this.settings);
    } else if (this.instance) {
      this.init();
    }

    this.dragAndDropPages = DragAndDropPages;
    this.dragAndDropPages.init(this);
  },
  unmounted() {
    this.dragAndDropPages.unload();
  },
  setup() {
    const ASCENDING  = 'ascending';
    const DESCENDING = 'descending';

    return {ASCENDING, DESCENDING};
  },
  methods: {
    async filter() {
      await this.$appUtil.doAction('datatable/filter', {
        instance: this.instance, search: this.search, sort: this.sortKey, sortDirection: this.sortDirection,
        page: this.page, language: this.language, filters: this.filterValuesCompressed
      }, (response: any) => {
        this.data     = response.data.data;
        this.pages    = response.data.pages;
        this.selected = [];

        this.forceDefaultView = !!(this.search || this.sortKey);
      })
    },

    convertSettings(settings: any) {
      this.headers       = settings.headers;
      this.data          = settings.data;
      this.form          = settings.form;
      this.buttons       = settings.buttons;
      this.filters       = settings.filters;
      this.pages         = settings.pages;
      this.languages     = settings.languages;
      this.language      = settings.language;
      this.actions       = settings.actions;
      this.mobileColumns = settings.mobileColumns;
    },

    clearSearch() {
      this.search = '';
    },

    /**
     * @param button
     */
    buttonClick(button: any) {
      let selectedCount = this.selected.length;

      if (button.action == 'add') {
        this.$appUtil.doAction('datatable/add', {instance: this.instance}, (response: any) => {
          this.dialog       = true;
          this.dialogEditId = null;
          this.form         = response.data.form;
          this.editData     = {};
        });
      }

      if (button.action == 'delete') {
        if (selectedCount > 0) {
          let confirmed = false;

          if (selectedCount > 1) {
            confirmed = confirm(this.$translator.tl('datatable.deleteMultiple', {amount: selectedCount}));
          } else {
            confirmed = confirm(this.$translator.tl('datatable.deleteSinlge'));
          }

          if (confirmed) {
            this.delete();
          }
        }
      }
    },

    /**
     * @param val
     */
    changeLanguage(val: string) {
      this.language = val;
      this.filter();
    },

    async delete() {
      await this.$appUtil.doAction('datatable/delete', {
        instance: this.instance,
        ids: this.selected
      }, (response: any) => {
        this.data     = response.data;
        this.selected = [];
      });
    },

    /**
     * Get datatable css classes
     */
    getClasses() {
      let classes = ['datatable'];

      if (this.settings) {
        classes.push(this.settings.class);
      }

      if (this.noselect || this.dragAndDropPages.itemIdMouseDown || this.mouseDownOnRearrange) {
        classes.push('noselect');
      }

      if (this.startedDragging) {
        classes.push('startedDragging');
      }

      return classes;
    },

    /**
     * @param button
     */
    isDisabled(button: any) {
      if (button.action == 'delete') {
        return this.selected.length < 1;
      }
    },

    async init() {
      this.error = '';

      await this.$appUtil.doAction('datatable', {instance: this.instance}, (response: any) => {
        this.convertSettings(response.data.settings);
      });
    },

    /**
     * @param id
     * @param event
     */
    async edit(id: number, event: MouseEvent) {
      event.stopPropagation();

      await this.$appUtil.doAction('datatable/edit', {instance: this.instance}, (response: any) => {
        this.dialog       = true;
        this.dialogEditId = id;
        this.form         = response.data.form;
        this.editData     = response.data.data;
      });
    },

    /**
     * @param event
     */
    keyDown(event: KeyboardEvent) {
      this.noselect = event.shiftKey;
    },

    keyUp() {
      this.noselect = false;
    },

    async searchAction(search: string) {
      this.search = search;
      await this.filter();
    },

    /**
     * @param dialogEditId
     * @param data
     * @param close
     */
    async save(dialogEditId: any, data: any, close: boolean = false) {
      await this.$appUtil.doAction('datatable/save', {
        instance: this.instance,
        data: data,
        id: dialogEditId
      }, (response: any) => {
        this.data = response.data;

        if (close) {
          this.dialog = false;
        } else {
          this.saved = true;
        }
      });
    },

    /**
     * @param itemIdMouseDown
     * @param itemIdMouseOver
     * @param location
     */
    async pageRearrange(itemIdMouseDown: string, itemIdMouseOver: string, location: number) {
      await this.$appUtil.doAction('datatable/page/rearrange', {
        instance: this.instance, source: itemIdMouseDown, target: itemIdMouseOver, location: location
      }, (response: any) => {
        this.data = response.data;
      });
    },

    /**
     * @param id
     * @param collapsed
     * @param index
     */
    async collapse(id: string, collapsed: boolean, index: number) {
      this.data[index].collapsed = collapsed;
      await this.$appUtil.doAction('datatable/collapse', {instance: this.instance, id: id, collapsed: collapsed});
    },

    /**
     * @param id
     * @param selected
     * @param index
     * @param event
     */
    toggle(id: string, selected: boolean, index: number, event: MouseEvent) {
      if (selected) {
        if (event.shiftKey && this.lastIndex !== null) {
          let start = this.lastIndex;
          let end   = index;

          if (index < this.lastIndex) {
            start = index;
            end   = this.lastIndex;
          }

          for (let i = start; i <= end; i++) {
            let row = this.data[i];
            this.selected.push(row.id);
          }

          event.preventDefault();

          this.lastIndex = index;

        } else {
          this.selected.push(id);
          this.lastIndex = index;
        }
      } else {
        let index = this.selected.indexOf(id);
        this.selected.splice(index, 1);
      }
    },

    inputChange() {
      this.saved = false;
    },

    /**
     * @param id
     */
    isSelected(id: string): boolean {
      return this.selected.includes(id);
    },

    /**
     * @param key
     */
    async sort(key: string) {
      if (this.sortKey !== key) {
        this.sortKey       = key;
        this.sortDirection = this.ASCENDING;
      } else {
        if (this.sortDirection == this.ASCENDING) {
          this.sortDirection = this.DESCENDING;
        } else {
          this.sortDirection = this.ASCENDING;
          this.sortKey       = '';
        }
      }

      await this.filter();
    },

    setPage(page: number) {
      if (!page) {
        return;
      }

      this.page = page;
      this.filter();
    },

    /**
     * @param index
     */
    parentIsOpen(index: number): boolean {
      if (this.forceDefaultView) {
        return true;
      }

      let row = this.data[index];

      if (row.level < 1) {
        return true;
      } else {
        return !this.getParentIsCollapsed(index);
      }
    },

    /**
     * @param index
     */
    getParentIsCollapsed(index: number): boolean {
      let targetLevel = this.data[index].level;

      for (let i = index; i >= 0; i--) {
        let level = this.data[i].level;

        if (level < targetLevel) {
          if (this.data[i].collapsed) {
            return true;
          } else {
            targetLevel = level;
          }
        }
      }

      return false;
    }
  }
});

</script>

<template>
  <div ref="datatable" :class="getClasses()" v-if="instance" @keydown="keyDown" @keyup="keyUp"
       tabindex="0">
    <div class="datatable__error" v-if="error">
      {{ error }}
    </div>
    <template v-else>
      <div class="datatable__toolbar">
        <div class="datatable__toolbar__buttons" ref="toolbarButtons" :class="isWrapped ? 'wrapped' : ''">
          <template v-for="button in buttons">
            <v-btn @click="buttonClick(button)" :disabled="isDisabled(button)" :prepend-icon="button.icon">
              {{ button.label }}
            </v-btn>
          </template>
          <template v-for="filter in filters">
            <v-select :multiple="filter.multiple" :items="filter.items" v-model="filterValues[filter.key]"
                      :label="filter.label" density="compact" :max-width="filter.width ? filter.width : 200"
                      return-object :clearable="!filter.multiple"></v-select>
          </template>
          <div class="datatable__toolbar__buttons__right">
            <div v-if="pages" class="pages">
            <span class="page" :class="pageNr ? (pageNr == page ? 'selected' : '') : 'disabled'" v-for="pageNr in pages"
                  @click="setPage(pageNr)">
              {{ pageNr ? pageNr : '...' }}
            </span>
            </div>
            <v-select v-if="languages" :items="languages" item-title="label" @update:modelValue="changeLanguage"
                      item-value="key" density="compact" class="language" v-model="language"/>
            <ToolbarSearch @search="searchAction"/>
          </div>
        </div>
      </div>
      <div class="datatable__table">
        <table ref="table">
          <thead>
          <tr>
            <th v-for="(name, key) in headers" @click="sort(key.toString())"
                :class="mobileColumns.includes(key) ? 'mobile' : ''">
              {{ name }}
              <i v-if="key.toString() == sortKey && sortDirection == ASCENDING" class="mdi mdi-sort-ascending"></i>
              <i v-if="key.toString() == sortKey && sortDirection == DESCENDING" class="mdi mdi-sort-descending"></i>
            </th>
            <th class="button-column"></th>
          </tr>
          </thead>
          <tbody>
          <template v-for="(row, index) in data">
            <Row v-if="parentIsOpen(index)" :row="row" :dragAndDropPages="dragAndDropPages" :headers="headers"
                 :actions="actions" :selected="isSelected(row.id)" @toggle="toggle" :settings="settings"
                 @collapse="collapse" @edit="edit" :id="row.id" :level="row.level" :selectedIds="selected"
                 :max="row.max" :highlight="highlight" :index="index" :forceDefaultView="forceDefaultView"
                 :mobile-columns="mobileColumns" @mouseDownOnRearrange="setMouseDownOnRearrange" :dragClone="row.clone"
                 :cloneRowVisible="cloneRowVisible"/>
          </template>
          </tbody>
        </table>
      </div>
      <div class="bottom-bar">
        <div v-if="pages" class="pages">
            <span class="page" :class="pageNr ? (pageNr == page ? 'selected' : '') : 'disabled'" v-for="pageNr in pages"
                  @click="setPage(pageNr)">
              {{ pageNr ? pageNr : '...' }}
            </span>
        </div>
      </div>
    </template>
  </div>
  <EditDialog :dialog="dialog" :dialogEditId="dialogEditId" :form="form ?? {}" @clickClose="dialog = false"
              @clickSave="save" :data="editData" :darkMode="darkMode" :level="level" ref="editDialog"
              :parent-saved="saved" @input-change="inputChange"/>
</template>

<style lang="scss" scoped>
.datatable {

  &__toolbar {
    margin-bottom: $spaceLogoMenu;

    &__buttons {
      $self: &;
      display: flex;
      flex-wrap: wrap;
      gap: 5px;

      :deep(.icon--add) {
        top: 1px;
      }

      :deep(.icon--delete) {
        top: 1px;
      }

      :deep(svg) {
        width: 20px;
        height: 20px;
        margin-right: 5px;
        fill: var(--color-text);

        line {
          stroke: var(--color-text);
        }
      }

      &__right {
        margin-left: auto;
        display: flex;
        gap: 5px;
        white-space: nowrap;
        flex-wrap: wrap;
      }

      .v-btn--disabled {
        :deep(svg) {
          opacity: .3;
        }
      }

      &.wrapped {
        #{$self}__right {
          margin-left: 0;
        }
      }
    }

    .v-select {
      height: 36px;

      :deep(.v-input__details) {
        position: absolute;
      }

      :deep(.v-input__control) {
        height: 36px;
      }

      :deep(.v-field-label) {
        margin-top: -1px;
      }

      :deep(.v-field--focused .v-field-label), &--selected :deep(.v-field-label) {
        margin-top: -11px;
        margin-left: 10px;
        font-size: 10px;
      }

      :deep(input), :deep(.v-field__input) {
        padding: 6px 10px;
        margin-top: -2px;
      }

      :deep(.v-field__input) {
        flex-flow: nowrap;
        overflow: hidden;
      }
    }

    .language {
      max-width: 200px;
    }
  }

  &__table {
    table {
      border-spacing: 0;
      border-collapse: separate;
      width: 100%;
      position: relative;

      :deep(td), th {
        padding: $tableRowTopPadding 15px;
        position: relative;
      }

      .button-column {
        display: none;

        @media (max-width: $screen-sm-max) {
          display: inline-table;
        }
      }

      thead th {
        text-align: left;
        font-weight: bold;
        cursor: pointer;
        @include noSelect();

        .mdi {
          position: absolute;
          font-size: 23px;
          color: var(--color-text-gray);
          margin-left: 8px;
          margin-top: -5px;
        }
      }

      tbody {
        :deep(tr:nth-child(odd)) {
          background-color: var(--color-background-shade1);
        }

        :deep(tr:hover:not(.mouseDownRearrange)) {
          background-color: var(--color-background-shade2);
        }
      }

      @media (max-width: $screen-sm-max) {
        th {
          display: none;

          &.mobile {
            display: table-cell;
          }
        }
      }
    }
  }

  .bottom-bar {
    display: flex;
    justify-content: flex-end;

    .pages {
      margin-top: 20px;
    }
  }

  .pages {
    display: inline-block;

    .page {
      display: inline-block;
      padding: 5px;
      border: 1px solid var(--color-line);
      min-width: 38px;
      text-align: center;
      margin-right: -1px;

      &:not(.disabled):hover {
        background-color: var(--color-background-shade3);
        cursor: pointer;
      }

      &:last-child {
        border-bottom-right-radius: var(--border-radius);
        border-top-right-radius: var(--border-radius);
      }

      &:first-child {
        border-bottom-left-radius: var(--border-radius);
        border-top-left-radius: var(--border-radius);
      }

      &.selected, &.selected:hover {
        background-color: var(--main-color);
        border-color: var(--main-color);
        color: var(--color-text-in-main-bg);
      }
    }
  }

  &.noselect {
    @include noSelect();
  }

  &.startedDragging {
    cursor: grabbing;
  }
}

.v-overlay {
  .datatable {
    border: 1px solid var(--color-background-shade3);
    border-radius: var(--border-radius);

    tbody :deep(tr:last-child td:first-child) {
      border-bottom-left-radius: var(--border-radius);
    }

    tbody :deep(tr:last-child td:last-child) {
      border-bottom-right-radius: var(--border-radius);
    }
  }

  .datatable__toolbar {
    margin-bottom: 20px;
    padding: 15px;
  }
}

body.transitioning {
  table tbody :deep(tr) {
    transition: background-color var(--color-scheme-transition-speed);
  }
}

</style>