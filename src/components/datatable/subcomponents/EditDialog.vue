<script lang="ts">
import {defineComponent} from "vue";
import validator from "@/classes/validator";

export default defineComponent({
  name: "EditDialog",
  props: ['dialog', 'form', 'dialogEditId', 'data'],
  data() {
    return {
      validator: validator,
    };
  },
  methods: {
    async clickSave() {
      let isValid = await this.getForm().validate();

      if (isValid.valid) {
        this.$emit('clickSave');
      }
    },
    reset() {
      this.getForm().reset()
    },

    getForm() {
      let thisComponent: any = this;
      return thisComponent.$refs.form;
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
    <v-dialog v-model="dialog" persistent width="1200">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ dialogEditId ? 'Edit ' + dialogEditId : 'Add' }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form">
              <v-row>
                <v-col v-for="field in form.fields ?? {}" cols="12" :md="field.size ? field.size.md : 0"
                       :sm="field.size ? field.size.sm : 0">
                  <v-text-field
                      v-if="field.type == 'text'" :label="field.label" :hint="field.hint" required validate-on="blur"
                      :rules="field.validator ? validator.get(field.validator.name, field.validator.parameters) : []"
                      :model-value="data[field.key]"/>
                  <v-text-field v-if="field.type == 'password'" type="password" :label="field.label" required
                                :model-value="data[field.key]" autocomplete="new-password" />
                  <v-select v-if="field.type == 'select'" item-value="key" item-title="value" :items="field.items"
                            :label="field.label" required :model-value="data[field.key]"/>
                  <v-autocomplete v-if="field.type == 'autocomplete'" item-value="key" item-title="value"
                                  :items="field.items" :label="field.label" required :multiple="field.multiple"
                                  :model-value="data[field.key]"/>
                  <DataTable v-if="field.type == 'datatable'" :settings="{}" :instance="'test'"/>
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

</style>