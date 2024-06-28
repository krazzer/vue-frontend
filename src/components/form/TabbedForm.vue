<script lang="ts">
import {defineComponent} from 'vue'
import Form from "@/components/form/Form.vue";

export default defineComponent({
  name: "TabbedForm",
  props: ['form', 'darkMode', 'data'],
  emits: ['submit'],
  components: {Form},
  data() {
    return {
      tab: null,
    };
  },
})
</script>

<template>
  <v-tabs v-if="form.tabs" v-model="tab">
    <v-tab v-for="tab in form.tabs" :value="tab.key">{{ tab.name }}</v-tab>
  </v-tabs>
  <v-form ref="form" v-on:submit.prevent v-on:submit="$emit('submit')">
    <v-tabs-window v-if="form.tabs" v-model="tab">
      <v-tabs-window-item v-for="tab in form.tabs" :value="tab.key">
        <Form :fields="tab.fields" :data="data" :darkMode="darkMode"/>
      </v-tabs-window-item>
    </v-tabs-window>
    <Form v-else :fields="form.fields" :data="data" :darkMode="darkMode"/>
  </v-form>
</template>

<style scoped lang="scss">
  .v-dialog form{
    padding: 24px;
  }
</style>