<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "EditDialog",
  props: ['dialog'],
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
          <v-btn color="blue-darken-1" variant="text" @click="$emit('clickClose')">Close</v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="$emit('clickSave')">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<style scoped lang="scss">

</style>