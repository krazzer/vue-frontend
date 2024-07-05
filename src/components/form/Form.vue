<script lang="ts">
import {defineComponent} from 'vue'
import validator from "@/classes/validator";
import Editor from "@tinymce/tinymce-vue";
import {useTheme} from "vuetify";

export default defineComponent({
  name: "Form",
  props: ['fields', 'data', 'darkMode'],
  components: {Editor},
  data() {
    return {
      darkModeSelect: null,
      validator: validator,
      theme: useTheme()
    };
  },
  watch: {
    'data.darkmode'(val) {
      switch (val){
        case 'light':
          this.$darkMode.value = false;
        break;
        case 'dark':
          this.$darkMode.value = true;
          break;
        default:
          this.$darkMode.value = null;
          break;
      }

      localStorage.darkMode = JSON.stringify(this.$darkMode.value);
    }
  },
  mounted(){
    if(this.hasDarkModeField()) {
      switch (this.$darkMode.value) {
        case true:
          this.data.darkmode = 'dark';
          break;
        case false:
          this.data.darkmode = 'light';
          break;
        default:
          this.data.darkmode = 'default';
          break;
      }
    }
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
    },

    hasDarkModeField(): boolean{
      if( ! this.fields) {
        return false;
      }

      let returnValue = false;

      this.fields.forEach((field: any) => {
        if(field.key === 'darkmode'){
          returnValue = true;
        }
      });

      return returnValue;
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
        <v-text-field v-if="field.type == 'text'" :label="field.label" :hint="field.hint" required validate-on="blur"
                      :rules="field.validator ? validator.get(field.validator.name, field.validator.parameters) : []"
                      :value="data[field.key]" v-model="data[field.key]" hide-details="auto"/>
        <v-textarea v-if="field.type == 'textarea'" :label="field.label" :hint="field.hint" required validate-on="blur"
                    :rules="field.validator ? validator.get(field.validator.name, field.validator.parameters) : []"
                    :value="data[field.key]" v-model="data[field.key]" hide-details="auto"/>
        <Editor v-if="field.type == 'richtext'" :api-key="tinyMCEApiKey()" v-model="data[field.key]"
                :init="initTinyMCE()" :initial-value="data[field.key]"/>
        <v-text-field v-if="field.type == 'password'" type="password" :label="field.label" required hide-details="auto"
                      :value="data[field.key]" v-model="data[field.key]" autocomplete="new-password"/>
        <v-select v-if="field.type == 'select'" item-value="key" item-title="value" :items="field.items"
                  :label="field.label" required :value="data[field.key]" v-model="data[field.key]" hide-details="auto"/>
        <v-autocomplete v-if="field.type == 'autocomplete'" item-value="key" item-title="value"
                        :items="field.items" :label="field.label" required :multiple="field.multiple"
                        :value="data[field.key]" v-model="data[field.key]" hide-details="auto"/>
        <v-checkbox v-if="field.type == 'checkbox'" :label="field.label" :hint="field.hint" required validate-on="blur"
                    :rules="field.validator ? validator.get(field.validator.name, field.validator.parameters) : []"
                    :value="data[field.key]" v-model="data[field.key]" hide-details="auto"/>
        <DataTable v-if="field.type == 'datatable'" :instance="field.instance"/>
      </v-col>
    </v-row>
</template>

<style scoped lang="scss">

</style>