<script lang="ts">
import {defineComponent} from 'vue'
import Form from "@/components/form/Form.vue";

export default defineComponent({
  name: "TabbedForm",
  props: ['form', 'darkMode', 'data', 'checkTabErrors', 'level', 'handleSubmit'],
  emits: ['submit', 'inputChange'],
  components: {Form},
  data() {
    return {
      tab: null,
      tabErrors: <any>{},
      forms: <any>[],
      saved: false,
      checkTabErrorsLocal: false,
    };
  },
  watch: {
    checkTabErrors() {
      this.checkTabErrorsLocal = this.checkTabErrors;
    }
  },
  methods: {
    getClass(tab: string): string {
      if (this.tabErrors[tab]) {
        return 'error';
      }

      return '';
    },

    async handleLocalSave(){
      let isValid = await (this.$refs.form as any).validate();

      if (!isValid.valid) {
        this.checkTabErrorsLocal = true;
        return;
      }

      this.checkTabErrorsLocal = false
      await this.save();
    },

    setTabError(tab: string, set: boolean) {
      this.tabErrors[tab] = set;
    },

    async save() {
      await this.$appUtil.doAction('form/save', {
        instance: this.form.instance,
        data: this.data,
      }, () => {
        this.saved = true;
      });
    },

    async submit(close: boolean = false) {
      if (this.handleSubmit && this.form.instance) {
        await this.handleLocalSave();
      } else {
        this.$emit('submit', close);
      }
    },

    inputChange() {
      this.saved = false;
      this.$emit('inputChange');
    }
  }
})
</script>

<template>
  <v-tabs v-if="form.tabs" v-model="tab">
    <v-tab v-for="tab in form.tabs" :value="tab.key" :class="getClass(tab.key)">{{ tab.name }}</v-tab>
  </v-tabs>
  <v-form ref="form" v-on:submit.prevent v-on:submit="submit(false)">
    <v-tabs-window v-if="form.tabs" v-model="tab">
      <v-tabs-window-item v-for="tab in form.tabs" :value="tab.key">
        <Form :fields="tab.fields" :data="data" :darkMode="darkMode" @fieldError="setTabError" :saved="saved"
              :checkErrors="checkTabErrorsLocal" :tab="tab.key" :save="tab.save" :level="level" @do-submit="submit"
              @input-change="inputChange"/>
      </v-tabs-window-item>
    </v-tabs-window>
    <Form v-else :fields="form.fields" :save="form.save" :data="data" :level="level" :darkMode="darkMode" :saved="saved"
          ref="oneForm" @do-submit="submit" @input-change="inputChange"/>
  </v-form>
</template>

<style scoped lang="scss">
.v-dialog form {
  padding: 24px;

  @media (max-width: $screen-sm-max) {
    padding: 15px;
  }
}

.v-tab.error {
  color: rgb(var(--v-theme-error));
}
</style>