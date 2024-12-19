<script lang="ts">
import {defineComponent} from "vue";
import validator from "@/classes/validator";
import Editor from '@tinymce/tinymce-vue';
import TabbedForm from "@/components/form/TabbedForm.vue"

export default defineComponent({
  name: "EditDialog",
  props: ['dialog', 'form', 'dialogEditId', 'data', 'values', 'darkMode', 'level', 'parentSaved'],
  emits: ['clickSave', 'clickClose', 'inputChange'],
  components: {Editor, TabbedForm},
  data() {
    return {
      validator: validator,
      checkTabErrors: false,
      tab: null,
      saved: false,
    };
  },
  methods: {
    async clickSave(close: boolean){
      let isValid = await this.getForm().validate();

      if (isValid.valid) {
        this.$emit('clickSave', this.dialogEditId, this.data, close);
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

    inputChange() {
      this.saved = false;
      this.$emit('inputChange');
    },
  },
  watch: {
    dialog() {
      if (!this.dialog) {
        this.checkTabErrors = false;
      }
    },
    parentSaved() {
      this.saved = this.parentSaved;
    }
  }
});
</script>
<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent :eager="true" :retain-focus="false" :data-level="level">
      <v-card height="100vh">
        <v-card-title>
          <span class="text-h5">{{ dialogEditId ? 'Edit ' + dialogEditId : 'Add' }}</span>
          <span class="close">
            <i class="mdi mdi-close" @click="$emit('clickClose')"></i>
          </span>
        </v-card-title>
        <TabbedForm v-if="dialog" ref="tabbedForm" :form="form" :data="data" @submit="clickSave" :darkMode="darkMode"
                    :checkTabErrors="checkTabErrors" :level="level" @input-change="inputChange"/>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="tonal" @click="$emit('clickClose')" prepend-icon="mdi-close">
            {{ $translator.tl('general.close') }}
          </v-btn>
          <v-btn variant="tonal" @click="clickSave(false)" :prepend-icon="saved ? 'mdi-check' : 'mdi-content-save'">
            {{ saved ? $translator.tl('general.saved') : $translator.tl('general.save') }}
          </v-btn>
          <v-btn variant="tonal" @click="clickSave(true)" prepend-icon="mdi-content-save">
            {{ $translator.tl('general.saveAndClose') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<style scoped lang="scss">
@import "@/assets/media-query-sizes.scss";

.v-card {
  transition-duration: var(--color-scheme-transition-speed);
}

.v-card-actions {
  margin-top: auto;
  padding: 24px;
  flex-wrap: wrap;
  row-gap: 0.5rem;
  align-items: flex-end;

  @media (max-width: $screen-sm-max) {
      padding: 15px;
  }
}

.v-card-title {
  position: relative;
}

.v-dialog {
  width: 1200px;

  @for $i from 1 through 10 {
    &[data-level="#{$i}"] {
      width: 1200px - (24 * $i);
      height: 100% - (2 * $i);
    }
  }

  @for $i from 11 through 100 {
    &[data-level="#{$i}"] {
      width: 1200px - (24 * 10);
      height: 100% - (2 * 10);
    }
  }

  @media (max-width: 1200px) {
    width: 100% !important;

    :deep(.v-overlay__content){
      max-height: calc(100% - 24px);
      width: calc(100% - 24px);
      max-width: calc(100% - 24px);
    }
  }
}

.close {
  position: absolute;
  right: 24px;
  font-size: 30px;
  top: 10px;

  .mdi {
    cursor: pointer;
  }
}
</style>