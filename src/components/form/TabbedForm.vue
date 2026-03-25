<script lang="ts">
import {defineComponent} from 'vue'
import Form from "@/components/form/Form.vue";

export default defineComponent({
  name: "TabbedForm",
  props: ['form', 'darkMode', 'data', 'checkTabErrors', 'level', 'handleSubmit', 'helperData', 'instance', 'editId'],
  emits: ['submit', 'inputChange', 'dialogChange'],
  components: {Form},
  data() {
    return {
      tab: null,
      tabErrors: <any>{},
      forms: <any>[],
      saved: false,
      isSaving: false,
      checkTabErrorsLocal: false,
      localForm: this.form,
    };
  },
  watch: {
    checkTabErrors() {
      this.checkTabErrorsLocal = this.checkTabErrors;
    },
    form: {
      immediate: true,
      deep: true,
      handler(form) {
        this.localForm = form;
      }
    },
  },
  methods: {
    getClass(tab: string): string {
      if (this.tabErrors[tab]) {
        return 'error';
      }

      return '';
    },

    async handleLocalSave() {
      this.isSaving = true;
      let isValid   = await (this.$refs.form as any).validate();

      if (!isValid.valid) {
        this.checkTabErrorsLocal = true;
        return;
      }

      this.checkTabErrorsLocal = false
      await this.save();
      this.isSaving = false;
    },

    setTabError(tab: string, set: boolean) {
      this.tabErrors[tab] = set;
    },

    async save() {
      await this.$appUtil.doAction('form/save', {
        name: this.localForm.name,
        data: this.data,
      }, () => {
        this.saved = true;
      });
    },

    async submit(close: boolean = false) {
      if (this.handleSubmit && this.localForm.name) {
        await this.handleLocalSave();
      } else {
        this.$emit('submit', close);
      }
    },

    inputChange() {
      this.saved = false;
      this.$emit('inputChange');
    },

    forwardDialogChange(...args: any) {
      this.$emit('dialogChange', ...args)
    },

    async updateForm(trigger: string, data: object|any) {
      if (this.editId) {
        data.id = this.editId;
      }

      let params = {instance: this.instance, trigger: trigger, data: data};

      await this.$appUtil.doAction('datatable/updateform', params, (response: any) => {
        this.localForm = response.data.form;
      });
    }
  }
})
</script>

<template>
  <v-tabs v-if="localForm && localForm.tabs" v-model="tab">
    <v-tab v-for="tab in localForm.tabs" :value="tab.key" :class="getClass(tab.key)">{{ tab.name }}</v-tab>
  </v-tabs>
  <v-form ref="form" v-on:submit.prevent v-on:submit="submit(false)">
    <v-tabs-window v-if="localForm && localForm.tabs" v-model="tab">
      <v-tabs-window-item v-for="tab in localForm.tabs" :value="tab.key">
        <Form :fields="tab.fields" :data="data" :darkMode="darkMode" @fieldError="setTabError" :saved="saved"
              :checkErrors="checkTabErrorsLocal" :tab="tab.key" :save="tab.save" :level="level" @do-submit="submit"
              @input-change="inputChange" :helperData="helperData" @dialog-change="forwardDialogChange"
              :instance="instance" :editId="editId" :isSaving="isSaving" @update-form="updateForm"/>
      </v-tabs-window-item>
    </v-tabs-window>
    <Form v-else-if="localForm && localForm.fields" :fields="localForm.fields" :save="localForm.save" :data="data"
          :level="level" :darkMode="darkMode" :saved="saved" ref="oneForm" @do-submit="submit"
          @input-change="inputChange" :helperData="helperData" :isSaving="isSaving"/>
  </v-form>
</template>

<style scoped lang="scss">
.v-dialog form {
  padding: 24px 24px 0 24px;

  @media (max-width: $screen-sm-max) {
    padding: 15px;
  }
}

.v-slide-group {
  overflow: visible;
}

.v-tab.error {
  color: rgb(var(--v-theme-error));
}
</style>