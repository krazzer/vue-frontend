<script lang="ts">
import {defineComponent} from "vue";
import axios from "axios";

export default defineComponent({
  name: "DataTable",
  props: ['settings', 'instance'],
  data() {
    return {
      addButtonLabel: null,
      headers: [],
      data: [],
      error: '',
    };
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
    }
  }
});

</script>

<template>
  <div class="datatable" v-if="instance">
    <div class="datatable__error" v-if="error">
      {{ this.error }}
    </div>
    <template v-else>
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
    </template>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/base.scss";

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