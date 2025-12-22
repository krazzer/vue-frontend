<script lang="ts">
import {defineComponent, toRaw} from "vue";
import EditDialog from "./subcomponents/EditDialog.vue";
import Row from "./subcomponents/Row.vue";
import Svg from "@/components/svg/Svg.vue";
import DragAndDropPages from "./classes/dragAndDropPages";
import ToolbarSearch from "@/components/toolbarsearch/ToolbarSearch.vue";
import DragAndDropTable from "@/mixins/DragAndDropTable.vue";
import DataTableToolbar from "@/components/datatable/subcomponents/DataTableToolbar.vue";

export default defineComponent({
  name: "DataTable",
  components: {DataTableToolbar, ToolbarSearch, Svg, EditDialog, Row},
  mixins: [DragAndDropTable],
  emits: ['noselect'],
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
      helperData: <any>{},
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
      showSearch: false,
      sortKey: '',
      sortDirection: '',
      selected: <any>[],
      lastIndex: <number | null>null,
      lastEditId: <number | null>null,
      lastEditIdFading: <number | null>null,
      noselect: false,
      forceDefaultView: false,
      saved: false,
      busyCollapsing: false,
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
      let params = {instance: this.instance, filters: this.getFilters()};

      await this.$appUtil.doAction('datatable/filter', params, (response: any) => {
        this.data     = response.data.data;
        this.pages    = response.data.pages;
        this.selected = [];

        this.forceDefaultView = !!(this.search || this.sortKey);
      })
    },

    getFilters(): object {
      return {
        search: this.search, sort: this.sortKey, sortDirection: this.sortDirection,
        page: this.page, language: this.language, filters: this.filterValuesCompressed
      };
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
      this.showSearch    = settings.search;
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
        this.$appUtil.doAction('datatable/add', {instance: this.instance, type: button.addType}, (response: any) => {
          this.dialog       = true;
          this.dialogEditId = null;
          this.form         = response.data.form;
          this.editData     = response.data.data || {};
        });
      }

      if (button.action == 'action') {
        if (button.actionConfirm && !confirm(button.actionConfirm)) {
          return;
        }

        this.$appUtil.doAction(button.actionRoute, {
          instance: this.instance,
          selected: this.selected
        }, (response: any) => {
          let data = response.data;

          if (data.message) {
            alert(data.message);
          }

          if (data.open) {
            window.open(data.open);
          }
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
        ids: this.selected,
        filters: this.getFilters()
      }, (response: any) => {
        this.data     = response.data.data;
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
        this.$appUtil.setPreventSelect(true);
      } else {
        this.$appUtil.setPreventSelect(false);
      }

      if (this.startedDragging) {
        classes.push('startedDragging');
      }

      return classes;
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

      await this.$appUtil.doAction('datatable/edit', {instance: this.instance, id: id}, (response: any) => {
        this.dialog       = true;
        this.dialogEditId = id;
        this.form         = response.data.form;
        this.editData     = response.data.data;
        this.helperData   = response.data.helperData;
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
        id: dialogEditId,
        filters: this.getFilters()
      }, (response: any) => {
        this.data       = response.data.data;
        this.lastEditId = response.data.id;

        setTimeout(() => {
          if (this.lastEditId == response.data.id) {
            this.lastEditIdFading = response.data.id;
            this.lastEditId       = null;

            setTimeout(() => {
              if (this.lastEditIdFading == response.data.id) {
                this.lastEditIdFading = null;
              }
            }, 1000);
          }
        }, 3000);

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
      if (!itemIdMouseOver) {
        return;
      }

      await this.$appUtil.doAction('datatable/page/rearrange', {
        instance: this.instance,
        source: parseInt(itemIdMouseDown),
        target: parseInt(itemIdMouseOver),
        location: location
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
      if (this.busyCollapsing) {
        return;
      }

      this.data[index].collapsed = collapsed;

      this.busyCollapsing = true;

      await this.$appUtil.doAction('datatable/collapse', {
        instance: this.instance, id: id, collapsed: collapsed
      }, () => {
        this.busyCollapsing = false;
      }, {
        afterError: () => {
          this.busyCollapsing = false;
        }
      });
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
      <DataTableToolbar :buttons="buttons" :filters="filters" :pages="pages" :languages="languages" :language="language"
                        :search="search" @buttonClick="buttonClick" @changeLanguage="changeLanguage" @setPage="setPage"
                        @searchAction="searchAction" :selected="selected" :filterValues="filterValues" :page="page"
                        :showSearch="showSearch"/>
      <div class="datatable__table">
        <table ref="table">
          <thead>
          <tr>
            <th v-for="(name, key) in headers" @click="sort(key.toString())"
                :class="mobileColumns && mobileColumns.includes(key) ? 'mobile' : ''">
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
                 :mobile-columns="mobileColumns || []" @mouseDownOnRearrange="setMouseDownOnRearrange"
                 :dragClone="row.clone" :busyCollapsing="busyCollapsing" :cloneRowVisible="cloneRowVisible"
                 :instance="instance" :justEdited="lastEditId == row.id"
                 :justEditedFading="lastEditIdFading == row.id"/>
          </template>
          </tbody>
        </table>
      </div>
      <div class="bottom-bar">
        <div v-if="pages" class="pagination">
            <span class="page" :class="pageNr ? (pageNr == page ? 'selected' : '') : 'disabled'" v-for="pageNr in pages"
                  @click="setPage(pageNr)">
              {{ pageNr ? pageNr : '...' }}
            </span>
        </div>
      </div>
    </template>
  </div>
  <EditDialog :dialog="dialog" :dialogEditId="dialogEditId" :form="form ?? {}" @clickClose="dialog = false"
              @clickSave="save" :data="editData" :helperData="helperData" :darkMode="darkMode" :level="level"
              ref="editDialog" :parent-saved="saved" @input-change="inputChange"/>
</template>

<style lang="scss" scoped>
@use '@/assets/css/pagination';

:deep(.v-list-item__prepend) {
  width: 40px;
}

.datatable {

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

    .pagination {
      margin-top: 20px;
    }
  }

  &.noselect {
    @include noSelect();
  }

  &.startedDragging {
    cursor: grabbing;
  }
}

.v-form {
  .datatable {
    border: 1px solid var(--color-background-shade3);
    border-radius: var(--border-radius);

    tbody :deep(tr:last-child td:first-child) {
      border-bottom-left-radius: var(--border-radius);
    }

    tbody :deep(tr:last-child td:last-child) {
      border-bottom-right-radius: var(--border-radius);
    }

    :deep(.toolbar) {
      margin-bottom: 20px;
      padding: 15px;
    }
  }
}

body.transitioning {
  table tbody :deep(tr) {
    transition: background-color var(--color-scheme-transition-speed);
  }
}

</style>
