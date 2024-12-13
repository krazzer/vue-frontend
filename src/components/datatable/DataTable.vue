<script lang="ts">
import {defineComponent} from "vue";
import EditDialog from "./subcomponents/EditDialog.vue";
import Row from "./subcomponents/Row.vue";
import Svg from "@/components/svg/Svg.vue";
import DragAndDropPages from "./classes/dragAndDropPages";
import ToolbarSearch from "@/components/toolbarsearch/ToolbarSearch.vue";

export default defineComponent({
  name: "DataTable",
  components: {ToolbarSearch, Svg, EditDialog, Row},
  props: {
    darkMode: Boolean,
    settings: {
      type: Object,
      default() {
        return {}
      }
    },
    instance: String,
  },
  data() {
    return {
      actions: <any>[],
      buttons: <any>[],
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
      headers: [],
      highlight: '',
      pages: <any>[],
      search: '',
      sortKey: '',
      sortDirection: '',
      selected: <any>[],
      lastIndex: <number | null>null,
      noselect: false,
      forceDefaultView: false,
    };
  },
  watch: {
    settings() {
      this.convertSettings(this.settings);
    },
    'dragAndDropPages.itemIdMouseDown'() {
      this.cloned = this.dragAndDropPages.itemIdMouseDown;
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
        page: this.page, language: this.language
      }, (response: any) => {
        this.data     = response.data.data;
        this.pages    = response.data.pages;
        this.selected = [];

        this.forceDefaultView = !!(this.search || this.sortKey);
      })
    },

    convertSettings(settings: any) {
      this.headers   = settings.headers;
      this.data      = settings.data;
      this.form      = settings.form;
      this.buttons   = settings.buttons;
      this.pages     = settings.pages;
      this.languages = settings.languages;
      this.language  = settings.language;
      this.actions   = settings.actions;
    },

    clearSearch() {
      this.search = ''; // Clear the search field
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

      if (this.noselect || this.dragAndDropPages.itemIdMouseDown) {
        classes.push('noselect');
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
     */
    async save(dialogEditId: any, data: any) {
      await this.$appUtil.doAction('datatable/save', {
        instance: this.instance,
        data: data,
        id: dialogEditId
      }, (response: any) => {
        this.data   = response.data;
        this.dialog = false;
      });
    },

    /**
     * @param itemIdMouseDown
     * @param itemIdMouseOver
     * @param location
     */
    async rearrange(itemIdMouseDown: string, itemIdMouseOver: string, location: number) {
      await this.$appUtil.doAction('datatable/rearrange', {
        instance: this.instance, source: itemIdMouseDown, target: itemIdMouseOver, location: location
      }, (response: any) => {
        this.data = response.data;
      });
    },

    resetForm() {
      let thisComp: any = this;
      thisComp.$refs.editDialog.$refs.tabbedForm.$refs.form.reset();
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
        <div class="datatable__toolbar__buttons">
          <template v-for="button in buttons">
            <v-btn @click="buttonClick(button)" :disabled="isDisabled(button)" :prepend-icon="button.icon">
              {{ button.label }}
            </v-btn>
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
        <table>
          <thead>
          <tr>
            <th v-for="(name, key) in headers" @click="sort(key.toString())">
              {{ name }}
              <i v-if="key.toString() == sortKey && sortDirection == ASCENDING" class="mdi mdi-sort-ascending"></i>
              <i v-if="key.toString() == sortKey && sortDirection == DESCENDING" class="mdi mdi-sort-descending"></i>
            </th>
          </tr>
          </thead>
          <tbody>
          <template v-for="(row, index) in data">
            <Row v-if="parentIsOpen(index)" :row="row" :dragAndDropPages="dragAndDropPages" :headers="headers"
                 :actions="actions" :selected="isSelected(row.id)" @toggle="toggle" :settings="settings"
                 @collapse="collapse" @edit="edit" :id="row.id" :level="row.level" :selectedIds="selected"
                 :max="row.max" :highlight="highlight" :index="index" :forceDefaultView="forceDefaultView"/>
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
              @clickSave="save" :data="editData" :darkMode="darkMode" ref="editDialog"/>
</template>

<style lang="scss" scoped>
@import "@/assets/base.scss";
@import "@/assets/media-query-sizes.scss";

.datatable {

  &__toolbar {
    margin-bottom: $spaceLogoMenu;

    &__buttons {
      display: flex;
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
      }

      .v-btn--disabled {
        :deep(svg) {
          opacity: .3;
        }
      }
    }

    .language {
      max-height: 36px;
      max-width: 200px;

      :deep(input), :deep(.v-field__input) {
        min-height: auto;
        padding: 6px 10px;
      }
    }
  }

  &__table {
    table {
      border-spacing: 0;
      border-collapse: separate;
      width: 100%;

      :deep(td), th {
        padding: 8px 15px;
        position: relative;
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

        :deep(tr:hover) {
          background-color: var(--color-background-shade2);
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