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
            <Row :row="row" :dragAndDropPages="dragAndDropPages" :headers="headers" :settings="settings"
                 @edit="edit(row.id)" :id="row.id" v-for="row in data" :level="0" />
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

.datatable {

  &__toolbar {
    margin-bottom: 50px;
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

body.transitioning {
  table tbody :deep(tr) {
    transition: background-color var(--color-scheme-transition-speed);
  }
}

</style>