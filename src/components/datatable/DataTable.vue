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
      dialog: false,
    };
  },
  watch: {
    settings(){
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
    }
  }
});

</script>

<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent width="1200">
      <v-card>
        <v-card-title>
          <span class="text-h5">User Profile</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field label="Legal first name*" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field label="Legal middle name" hint="example of helper text only on focus"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                    label="Legal last name*" hint="example of persistent helper text" persistent-hint required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field label="Email*" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field label="Password*" type="password" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select :items="['0-17', '18-29', '30-54', '54+']" label="Age*" required></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-autocomplete
                    :items="['Skiing', 'Ice hockey', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Basejump']"
                    label="Interests" multiple
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="dialog = false">Close</v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="dialog = false">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>

  <div class="datatable" v-if="instance">
    <div class="datatable__error" v-if="error">
      {{ error }}
    </div>
    <template v-else>
      <div class="datatable__toolbar">
        <v-btn class="btn" @click="dialog = true">{{ addButtonLabel }}</v-btn>
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