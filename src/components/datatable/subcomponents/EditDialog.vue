<script lang="ts">
import {defineComponent} from "vue";
import validator from "@/classes/validator";
import Editor from '@tinymce/tinymce-vue';
import TabbedForm from "@/components/form/TabbedForm.vue"

export default defineComponent({
  name: "EditDialog",
  props: ['dialog', 'form', 'dialogEditId', 'data', 'values', 'darkMode'],
  components: {Editor, TabbedForm},
  data() {
    return {
      validator: validator,
      checkTabErrors: false,
      tab: null,
    };
  },
  methods: {
    async clickSave() {
      let isValid = await this.getForm().validate();

      if (isValid.valid) {
        this.$emit('clickSave', this.dialogEditId, this.data);
      } else {
        this.checkTabErrors = true;
      }
    },
    reset() {
      this.getForm().reset();
      this.checkTabErrors = false;
    },

    getForm() {
      let thisComponent: any = this;
      return thisComponent.$refs.tabbedForm.$refs.form;
    },
  },
  watch: {
    dialog(){
      if( ! this.dialog){
        this.checkTabErrors = false;
      }
    }
  }
});
</script>
<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent width="1200" :eager="true" :retain-focus="false">
      <v-card height="100vh">
        <v-card-title>
          <span class="text-h5">{{ dialogEditId ? 'Edit ' + dialogEditId : 'Add' }}</span>
          <span class="close">
            <i class="mdi mdi-close" @click="$emit('clickClose')"></i>
          </span>
        </v-card-title>
        <TabbedForm ref="tabbedForm" :form="form" :data="data" @submit="clickSave" :darkMode="darkMode"
                    :checkTabErrors="checkTabErrors" />
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="tonal" @click="$emit('clickClose')" prepend-icon="mdi-close">Close</v-btn>
          <v-btn variant="tonal" @click="clickSave" prepend-icon="mdi-content-save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<style scoped lang="scss">
.v-card {
  transition-duration: var(--color-scheme-transition-speed);
}

.v-card-actions{
  margin-top: auto;
  padding: 24px;
}

.v-card-title{
  position: relative;
}

.close{
  position: absolute;
  right: 24px;
  font-size: 30px;
  top: 10px;

  .mdi{
    cursor: pointer;
  }
}
</style>