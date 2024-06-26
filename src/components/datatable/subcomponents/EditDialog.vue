<script lang="ts">
import {defineComponent} from "vue";
import validator from "@/classes/validator";
import Editor from '@tinymce/tinymce-vue';
import Form from "@/components/form/Form.vue";

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
      return thisComponent.$refs.tabbedForm.$refs.form;
    },
  }
});
</script>
<script lang="ts" setup>
import {defineAsyncComponent} from "vue";
import TabbedForm from "@/components/form/TabbedForm.vue";

const DataTable = defineAsyncComponent(() => import('../DataTable.vue'));
</script>
<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent width="1200" :eager="true" :retain-focus="false">
      <v-card height="100vh">
        <v-card-title>
          <span class="text-h5">{{ dialogEditId ? 'Edit ' + dialogEditId : 'Add' }}</span>
        </v-card-title>
        <TabbedForm ref="tabbedForm" :form="form" :data="data" @submit="clickSave" :darkMode="darkMode" />
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

:deep(.v-card-actions){
  padding: 24px;
}

:deep(form){
  padding: 24px;
}
</style>