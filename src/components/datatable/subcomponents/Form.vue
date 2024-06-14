<script lang="ts">
import {defineComponent} from 'vue'
import validator from "@/classes/validator";
import Editor from "@tinymce/tinymce-vue";

export default defineComponent({
  name: "Form",
  props: ['fields', 'data', 'darkMode'],
  components: {Editor},
  data() {
    return {
      validator: validator,
    };
  },
  methods: {
    initTinyMCE() {
      return {
        plugins: 'lists link image table code help wordcount',
        skin_url: this.darkMode ? '/cms/tinymceskin' : '',
        content_css: this.darkMode ? "/cms/tinymceskin/editor.min.css" : "",
      };
    },

    tinyMCEApiKey() {
      return import.meta.env.VITE_TINYMCE_API_KEY;
    }
  }
})
</script>
<script lang="ts" setup>
import {defineAsyncComponent} from "vue";
const DataTable = defineAsyncComponent(() => import('../DataTable.vue'));
</script>

<template>
  <v-container>
    <v-row>
      <v-col v-for="field in fields ?? {}" cols="12" :md="field.size ? field.size.md : 0"
             :sm="field.size ? field.size.sm : 0">
        <v-text-field
            v-if="field.type == 'text'" :label="field.label" :hint="field.hint" required
            validate-on="blur"
            :rules="field.validator ? validator.get(field.validator.name, field.validator.parameters) : []"
            :value="data[field.key]" v-model="data[field.key]"/>
        <Editor v-if="field.type == 'richtext'" :api-key="tinyMCEApiKey()" v-model="data[field.key]"
                :init="initTinyMCE()" :initial-value="data[field.key]"/>
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
  </v-container>
</template>

<style scoped lang="scss">

</style>