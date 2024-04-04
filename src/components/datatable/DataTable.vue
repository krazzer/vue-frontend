<script lang="ts">
import {defineComponent} from "vue";
import axios from "axios";
import EditDialog from "./subcomponents/EditDialog.vue";
import Svg from "@/components/svg/Svg.vue";

export default defineComponent({
  name: "DataTable",
  components: {Svg, EditDialog},
  props: ['settings', 'instance'],
  data() {
    return {
      addButtonLabel: null,
      headers: [],
      data: <any>[],
      error: '',
      dialog: false,
      dialogEditId: <any>null,
    };
  },
  watch: {
    settings() {
      this.convertSettings(this.settings);
    }
  },
  mounted() {
    if (this.settings) {
      this.convertSettings(this.settings);
    } else if (this.instance) {
      this.init();
    }
  },
  methods: {
    convertSettings(settings: any) {
      this.addButtonLabel = settings.addButtonLabel;
      this.headers        = settings.headers;
      this.data           = settings.data;
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
            this.dialog = true;
            this.dialogEditId = id;
            console.log(response.data);
          }).catch(error => {
            this.error = error;
          });
    },
  }
});

</script>

<template>
  <div class="datatable" :class="settings ? settings.class : null" v-if="instance">
    <div class="datatable__error" v-if="error">
      {{ error }}
    </div>
    <template v-else>
      <div class="datatable__toolbar">
        <v-btn @click="dialog = true; dialogEditId = null;">{{ addButtonLabel }}</v-btn>
      </div>
      <div class="datatable__table">
        <table>
          <thead>
          <tr>
            <th v-for="header in headers">{{ header }}</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="row in data">
            <td v-for="(cell, i) in row" :data-column="headers[i]">
              <template v-if="getCellType(i) == 'page'">
                <span class="arrow"></span>
                <span class="name">
                  <template v-if="typeof cell === 'object'">
                    <template v-for="icon in cell['icons']"><Svg :svg="icon"/></template>
                    {{ cell['label'] }}
                  </template>
                  <template v-else>{{ cell }}</template>
                </span>
              </template>
              <template v-else>{{ cell }}</template>
              <template v-if="i == row.length - 1">
                <div class="buttons">
                  <span @click="edit(i)"><Svg :svg="'edit'"/></span>
                </div>
              </template>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
  <EditDialog :dialog="dialog" :dialogEditId="dialogEditId" :form="settings.form ?? {}" @clickClose="dialog = false"
              @clickSave="dialog = false"/>
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

      tr:hover td .buttons{
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

      td .buttons{
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
          transition: background-color var(--color-scheme-transition-speed);
          background-color: var(--color-background-shade1);
        }

        tr:hover{
          background-color: var(--color-background-shade2);
        }
      }
    }
  }
}
</style>