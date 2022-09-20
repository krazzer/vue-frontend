<script lang="ts">
import {defineComponent} from "vue";
import axios from "axios";
import dataTableMock from "./classes/mock";

export default defineComponent({
  name: "DataTable",
  props: ['settings'],
  data() {
    return {
      addButtonLabel: null,
      headers: [],
      data: [],
      instance: null,
      error: '',
    };
  },
  mounted() {
    dataTableMock.mock(this.$mocker);

    let instance = this.$el.parentElement.getAttribute('data-instance');

    if (this.settings) {
      this.convertSettings(this.settings);
    }

    if (!this.settings && instance) {
      this.instance = instance;
      this.init();
    }
  },
  methods: {
    convertSettings(settings: any) {
      this.addButtonLabel = settings.addButtonLabel;
      this.headers        = settings.headers;
      this.data           = settings.data;
      this.instance       = settings.instance;
    },

    init(){
      axios
          .get('/api/datatable', {params: {instance: this.instance}})
          .then(response => {
            this.convertSettings(response.data.settings);
          }).catch(error => {
            console.error(error);
          });
    }
  }
});

</script>

<template>
  <div class="datatable" v-if="instance">
    <div class="datatable__toolbar">
      <a class="btn">{{ addButtonLabel }}</a>
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
          <td v-for="cell in row">{{ cell }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.datatable {

  &__toolbar {
    margin-bottom: 36px;
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