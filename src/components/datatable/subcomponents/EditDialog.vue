<script lang="ts">
import {defineComponent} from "vue";
import validator from "@/classes/validator";
import Editor from '@tinymce/tinymce-vue';
import Form from "@/components/datatable/subcomponents/Form.vue";

export default defineComponent({
  name: "EditDialog",
  props: ['dialog', 'form', 'dialogEditId', 'data', 'values', 'darkMode'],
  components: {Editor, Form},
  data() {
    return {
      validator: validator,
      tab: null,
    };
  },
  methods: {
    async clickSave() {
      let isValid = await this.getForm().validate();

      if (isValid.valid) {
        this.$emit('clickSave', this.dialogEditId, this.data);
      }
    },
    reset() {
      this.getForm().reset()
    },

    getForm() {
      let thisComponent: any = this;
      return thisComponent.$refs.form;
    },
  }
});
</script>
<script lang="ts" setup>
import {defineAsyncComponent} from "vue";

const DataTable = defineAsyncComponent(() => import('../DataTable.vue'));
</script>
<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent width="1200" :eager="true" :retain-focus="false">
      <v-card height="100vh">
        <v-card-title>
          <span class="text-h5">{{ dialogEditId ? 'Edit ' + dialogEditId : 'Add' }}</span>
        </v-card-title>
        <v-tabs v-if="form.tabs" v-model="tab">
          <v-tab v-for="tab in form.tabs" :value="tab.key">{{ tab.name }}</v-tab>
        </v-tabs>
        <v-card-text>
          <v-form ref="form" v-on:submit.prevent v-on:submit="clickSave">
            <v-tabs-window v-if="form.tabs" v-model="tab">
              <v-tabs-window-item v-for="tab in form.tabs" :value="tab.key">
                <Form :fields="tab.fields" :data="data" :darkMode="darkMode" />
              </v-tabs-window-item>
            </v-tabs-window>
            <Form v-else :fields="form.fields" :data="data" :darkMode="darkMode" />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="$emit('clickClose')">Close</v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="clickSave">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<style scoped lang="scss">
.v-card {
  transition-duration: var(--color-scheme-transition-speed);
}
</style>