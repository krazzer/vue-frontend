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
    };
  },
  methods: {
    getClass(tab: string): string {
      if (this.tabErrors[tab]) {
        return 'error';
      }

      return '';
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

    submit() {
      if (this.handleSubmit && this.form.instance) {
        if (this.form.instance) {
          this.save();
        }
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
  <v-form ref="form" v-on:submit.prevent v-on:submit="submit">
    <v-tabs-window v-if="form.tabs" v-model="tab">
      <v-tabs-window-item v-for="tab in form.tabs" :value="tab.key">
        <Form :fields="tab.fields" :data="data" :darkMode="darkMode" @fieldError="setTabError" :saved="saved"
              :checkErrors="checkTabErrors" :tab="tab.key" :save="tab.save" :level="level" @do-submit="submit"
              @input-change="inputChange"/>
      </v-tabs-window-item>
    </v-tabs-window>
    <Form v-else :fields="form.fields" :save="form.save" :data="data" :level="level" :darkMode="darkMode" :saved="saved"
          ref="oneForm" @do-submit="submit" @input-change="inputChange"/>
  </v-form>
</template>

<style scoped lang="scss">
@import "@/assets/media-query-sizes.scss";

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