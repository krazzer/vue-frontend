<script lang="ts">
import {defineComponent, type StyleValue} from "vue";
import axios from "axios";
import EditDialog from "./subcomponents/EditDialog.vue";
import Row from "./subcomponents/Row.vue";
import Svg from "@/components/svg/Svg.vue";
import DragAndDropPages from "./classes/dragAndDropPages";

export default defineComponent({
  name: "DataTable",
  components: {Svg, EditDialog, Row},
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
  computed: {
    dataTableStyle(): StyleValue {
      return this.dragAndDropPages.itemIdMouseDown ? {
        '-webkit-user-select': 'none',
        '-ms-user-select': 'none',
        'user-select': 'none',
      } : {};
    }
  },
  data() {
    return {
      selected: <any>[],
      headers: [],
      buttons: <any>[],
      data: <any>[],
      form: <any>[],
      editData: <any>[],
      error: '',
      dialog: false,
      dialogEditId: <any>null,
      dragAndDropPages: DragAndDropPages,
      cloned: <number | null>null,
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
  methods: {
    convertSettings(settings: any) {
      this.headers = settings.headers;
      this.data    = settings.data;
      this.form    = settings.form;
      this.buttons = settings.buttons;
    },

    /**
     * @param button
     */
    buttonClick(button: any) {
      let selectedCount = this.selected.length;

      if (button.action == 'add') {
        this.dialog       = true;
        this.dialogEditId = null;
        this.editData     = {};
        this.resetForm();
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

    async delete() {
      await axios
          .post('/api/datatable/delete', {params: {instance: this.instance, ids: this.selected}})
          .then(response => {
            this.data     = response.data;
            this.selected = [];
          }).catch(error => {
            alert(error);
          });
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

      await axios
          .get('/api/datatable', {params: {instance: this.instance}})
          .then(response => {
            this.convertSettings(response.data.settings);
          }).catch(error => {
            this.error = error;
          });
    },

    /**
     * @param id
     * @param event
     */
    async edit(id: number, event: MouseEvent) {
      event.stopPropagation();

      await axios
          .get('/api/datatable/edit', {params: {instance: this.instance}})
          .then(response => {
            this.dialog       = true;
            this.dialogEditId = id;
            this.editData     = response.data;

            this.resetForm();
          }).catch(error => {
            this.error = error;
          });
    },


    async save(dialogEditId: any, data: any) {
      await axios
          .get('/api/datatable/save', {params: {instance: this.instance, data: data, id: dialogEditId}})
          .then(response => {
            this.data   = response.data;
            this.dialog = false;
          }).catch(error => {
            alert(error);
          });
    },

    /**
     * @param itemIdMouseDown
     * @param itemIdMouseOver
     * @param location
     */
    async rearrange(itemIdMouseDown: string, itemIdMouseOver: string, location: number) {
      await axios
          .get('/api/datatable/rearrange', {
            params: {instance: this.instance, source: itemIdMouseDown, target: itemIdMouseOver, location: location}
          })
          .then(response => {
            this.data = response.data;
          }).catch(error => {
            alert(error);
          });
    },

    resetForm() {
      let thisComp: any = this;
      thisComp.$refs.editDialog.$refs.tabbedForm.$refs.form.reset();
    },

    /**
     * @param id
     * @param collapsed
     */
    async collapse(id: string, collapsed: boolean) {
      await axios
          .get('/api/datatable/collapse', {
            params: {instance: this.instance, id: id, collapsed: collapsed}
          }).catch(error => {
            alert(error);
          });
    },

    /**
     * @param id
     * @param selected
     */
    toggle(id: string, selected: boolean) {
      if (selected) {
        this.selected.push(id);
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
    }
  }
});

</script>

<template>
  <div ref="datatable" class="datatable" :class="settings ? settings.class : null" v-if="instance"
       :style="dataTableStyle">
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
        </div>
      </div>
      <div class="datatable__table">
        <table>
          <thead>
          <tr>
            <th v-for="header in headers">{{ header }}</th>
          </tr>
          </thead>
          <tbody>
          <Row v-for="row in data" :row="row" :dragAndDropPages="dragAndDropPages" :headers="headers"
               :selected="isSelected(row.id)" @toggle="toggle" :settings="settings" @collapse="collapse" @edit="edit"
               :id="row.id" :level="0" :selectedIds="selected" :max="row.max"/>
          </tbody>
        </table>
      </div>
    </template>
  </div>
  <EditDialog :dialog="dialog" :dialogEditId="dialogEditId" :form="form ?? {}" @clickClose="dialog = false"
              @clickSave="save" :data="editData" :darkMode="darkMode" ref="editDialog"/>
</template>

<style lang="scss" scoped>
@import "@/assets/base.scss";

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

      .v-btn--disabled {
        :deep(svg) {
          opacity: .3;
        }
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