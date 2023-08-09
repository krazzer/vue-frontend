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
      data: [],
      error: '',
      dialog: false,
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
        <v-btn @click="dialog = true">{{ addButtonLabel }}</v-btn>
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
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
  <EditDialog :dialog="dialog" :form="settings.form ?? {}" @clickClose="dialog = false" @clickSave="dialog = false"/>
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

      td, th {
        padding: 8px 15px;
      }

      thead th {
        text-align: left;
        font-weight: bold;
      }

      tbody {
        tr:nth-child(odd) {
          transition: background-color var(--color-scheme-transition-speed);
          background-color: var(--color-background-shade1);
        }
      }
    }
  }
}
</style>