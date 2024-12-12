<script lang="ts">
import {defineComponent} from 'vue'
import validator from "@/classes/validator";
import Editor from "@tinymce/tinymce-vue";
import {useTheme} from "vuetify";

export default defineComponent({
  name: "Form",
  props: ['fields', 'data', 'darkMode', 'checkErrors', 'tab'],
  emits: ['fieldError'],
  components: {Editor},
  data() {
    return {
      fieldRefs: <any>[],
      darkModeSelect: null,
      validator: validator,
      theme: useTheme(),
      fieldComponents: <any>{
        text: 'v-text-field',
        textarea: 'v-textarea',
        richtext: 'Editor',
        password: 'v-text-field',
        select: 'v-select',
        autocomplete: 'v-autocomplete',
        checkbox: 'v-checkbox',
        datatable: 'DataTable',
      },
    };
  },
  watch: {
    'data.darkmode'(val) {
      this.$darkMode.value  = val;
      localStorage.darkMode = JSON.stringify(this.$darkMode.value);
    },
    async checkErrors () {
      if (!this.checkErrors){
        this.$emit('fieldError', this.tab, false);
        return;
      }

      const fields = this.$refs.fieldRefs as any || [];

      let hasError = false;

      for (const field of fields) {
        if (typeof field.validate === 'function') {
          if (await this.fieldHasError(field)) {
            hasError = true;
          }
        }
      }

      if(hasError){
        this.$emit('fieldError', this.tab, true);
      }
    }
  },
  mounted() {
    if (this.hasDarkModeField()) {
      this.data.darkmode = this.$darkMode.value;
    }
  },
  methods: {
    async fieldHasError(field: any){
      let validation = await field.validate();

      return validation.length > 0;
    },

    initTinyMCE() {
      return {
        plugins: 'lists link image table code help wordcount',
        skin_url: this.darkMode ? '/cms/tinymceskin' : null,
        content_css: this.darkMode ? "/cms/tinymceskin/editor.min.css" : null,
      };
    },

    tinyMCEApiKey() {
      return import.meta.env.VITE_TINYMCE_API_KEY;
    },

    hasDarkModeField(): boolean {
      if (!this.fields) {
        return false;
      }

      let returnValue = false;

      this.fields.forEach((field: any) => {
        if (field.special === 'darkModeSelect') {
          returnValue = true;
        }
      });

      return returnValue;
    },
    getFieldProperties(field: any): any {
      let fieldProps: any = {
        label: field.label,
        hint: field.hint,
        validateOn: 'blur lazy',
        rules: field.validator ? validator.get(field.validator.name, field.validator.parameters) : [],
        value: this.data[field.key],
        hideDetails: 'auto',
      };

      if (field.type == 'richtext') {
        fieldProps.init   = this.initTinyMCE();
        fieldProps.apiKey = this.tinyMCEApiKey();
      }

      if (field.type == 'password') {
        fieldProps.autocomplete = 'new-password';
      }

      if (field.type == 'autocomplete') {
        fieldProps.multiple = field.multiple;
      }

      if (['select', 'autocomplete'].includes(field.type)) {
        fieldProps.itemValue = "key";
        fieldProps.itemTitle = "value";
        fieldProps.items     = field.items;
      }

      return fieldProps;
    }
  }
})
</script>
<script lang="ts" setup>
import {defineAsyncComponent} from "vue";

const DataTable = defineAsyncComponent(() => import('../datatable/DataTable.vue'));
</script>

<template>
  <v-row>
    <v-col v-for="field in fields ?? {}" cols="12" :md="field.size ? field.size.md : 0"
           :sm="field.size ? field.size.sm : 0">

      <DataTable v-if="field.type == 'datatable'" :instance="field.instance"/>
      <component v-else :is="fieldComponents[field.type]" v-bind="getFieldProperties(field)" v-model="data[field.key]"
                 ref="fieldRefs"/>
    </v-col>
  </v-row>
</template>

<style scoped lang="scss">

</style>