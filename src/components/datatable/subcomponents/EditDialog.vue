<script lang="ts">
import {defineComponent} from "vue";
import validator from "@/classes/validator";
import Editor from '@tinymce/tinymce-vue';

export default defineComponent({
  name: "EditDialog",
  props: ['dialog', 'form', 'dialogEditId', 'data', 'values', 'darkMode'],
  components: {Editor},
  data() {
    return {
      validator: validator,
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

    initTinyMCE(){
      return {
        plugins: 'lists link image table code help wordcount',
        skin_url: this.darkMode ? '/cms/tinymceskin' : '',
        content_css: this.darkMode ? "/cms/tinymceskin/editor.min.css" : "",
      };
    },

    tinyMCEApiKey(){
      return import.meta.env.VITE_TINYMCE_API_KEY;
    }
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
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ dialogEditId ? 'Edit ' + dialogEditId : 'Add' }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form" v-on:submit.prevent v-on:submit="clickSave">
              <v-row>
                <v-col v-for="field in form.fields ?? {}" cols="12" :md="field.size ? field.size.md : 0"
                       :sm="field.size ? field.size.sm : 0">
                  <v-text-field
                      v-if="field.type == 'text'" :label="field.label" :hint="field.hint" required validate-on="blur"
                      :rules="field.validator ? validator.get(field.validator.name, field.validator.parameters) : []"
                      :value="data[field.key]" v-model="data[field.key]"/>
                  <Editor v-if="field.type == 'richtext'" :api-key="tinyMCEApiKey()" v-model="data[field.key]"
                          :init="initTinyMCE()" :initial-value="data[field.key]" />
                  <v-text-field v-if="field.type == 'password'" type="password" :label="field.label" required
                                :value="data[field.key]" v-model="data[field.key]" autocomplete="new-password"/>
                  <v-select v-if="field.type == 'select'" item-value="key" item-title="value" :items="field.items"
                            :label="field.label" required :value="data[field.key]" v-model="data[field.key]"/>
                  <v-autocomplete v-if="field.type == 'autocomplete'" item-value="key" item-title="value"
                                  :items="field.items" :label="field.label" required :multiple="field.multiple"
                                  :value="data[field.key]" v-model="data[field.key]"/>
                  <DataTable v-if="field.type == 'datatable'" :instance="field.instance"/>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
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
.v-card{
  transition-duration: var(--color-scheme-transition-speed);
}
</style>