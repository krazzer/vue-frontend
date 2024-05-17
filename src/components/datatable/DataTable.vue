<script lang="ts">
import {defineComponent} from "vue";
import axios from "axios";
import EditDialog from "./subcomponents/EditDialog.vue";
import Page from "./subcomponents/Page.vue";
import Svg from "@/components/svg/Svg.vue";
import DragAndDropPages from "./classes/dragAndDropPages";

export default defineComponent({
  name: "DataTable",
  components: {Svg, EditDialog, Page},
  props: {
    settings: {
      type: Object,
      default() {
        return {}
      }
    },
    instance: String,
  },
  computed: {
    dataTableStyle() {
      return this.dragAndDropPages.itemIdMouseDown ? {
        '-webkit-user-select': 'none',
        '-ms-user-select': 'none',
        'user-select': 'none',
      } : {};
    }
  },
  data() {
    return {
      addButtonLabel: null,
      headers: [],
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
    this.dragAndDropPages.init();
  },
  unmounted() {
    this.dragAndDropPages.unload();
  },
  methods: {
    convertSettings(settings: any) {
      this.addButtonLabel = settings.addButtonLabel;
      this.headers        = settings.headers;
      this.data           = settings.data;
      this.form           = settings.form;
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
     * @param index
     */
    getCellSettings(index: number): any | null {
      let cellSettings = this.settings ? this.settings.cells : null;

      if (!cellSettings) {
        return null;
      }

      return cellSettings[this.settings.headers[index]];
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
     * @param id
     */
    async edit(id: number) {
      await axios
          .get('/api/datatable/edit', {params: {instance: this.instance}})
          .then(response => {
            this.dialog       = true;
            this.dialogEditId = id;
            this.editData     = response.data;
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
    }
  }
});

</script>

<template>
  <div ref="datatable" class="datatable" :class="settings ? settings.class : null" v-if="instance" :style="dataTableStyle">
    <div class="datatable__error" v-if="error">
      {{ error }}
    </div>
    <template v-else>
      <div class="datatable__toolbar">
        <v-btn @click="dialog = true; dialogEditId = null; editData = {};">{{ addButtonLabel }}</v-btn>
      </div>
      <div class="datatable__table">
        <table>
          <thead>
          <tr>
            <th v-for="header in headers">{{ header }}</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(row, id) in data">
            <td v-for="(cell, i) in row" :data-column="headers[i]" @mouseleave="dragAndDropPages.mouseLeave"
                @mouseenter="dragAndDropPages.mouseEnter(id, $event)" @mousemove="dragAndDropPages.mouseMoveContainer(id, $event)">
              <template v-if="getCellType(i) == 'page'">
                <Page v-if="cloned == id" :cell="cell" :cloned="true" @startDrag="dragAndDropPages.setMouseDown(id, $event)"
                      :x="dragAndDropPages.itemX" :y="dragAndDropPages.itemY"/>
                <Page :cell="cell" :id="id" :key="id" :dragAndDropPages="dragAndDropPages" :isDragged="dragAndDropPages.isDragged(id)"
                      @startDrag="dragAndDropPages.setMouseDown(id, $event)" ref="pages"/>
              </template>
              <template v-else>{{ cell }}</template>
              <template v-if="i == row.length - 1">
                <div class="buttons">
                  <span @click="edit(id)"><Svg :svg="'edit'"/></span>
                </div>
              </template>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
  <EditDialog :dialog="dialog" :dialogEditId="dialogEditId" :form="form ?? {}" @clickClose="dialog = false"
              @clickSave="save" :data="editData"/>
</template>

<style lang="scss" scoped>
@import "@/assets/base.scss";
@import "./styles/pages";

.datatable {

  &__toolbar {
    margin-bottom: 50px;
  }

  &__table {
    table {
      border-spacing: 0;
      border-collapse: separate;
      width: 100%;

      tr:hover td .buttons {
        display: inline-block;
      }

      td, th {
        padding: 8px 15px;
        position: relative;
      }

      thead th {
        text-align: left;
        font-weight: bold;
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

      tbody {
        tr:nth-child(odd) {
          background-color: var(--color-background-shade1);
        }

        tr:hover {
          background-color: var(--color-background-shade2);
        }
      }
    }
  }
}

body.transitioning {
  table tbody tr {
    transition: background-color var(--color-scheme-transition-speed);
  }
}

</style>