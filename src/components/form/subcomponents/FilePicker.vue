<script lang="ts">
import {defineComponent} from "vue";
import Media from "@/components/media/Media.vue";

export default defineComponent({
  name: "FilePicker",
  components: {Media},
  props: ["label", "hint", "validateOn", "rules", "hideDetails", "modelValue", "value"],
  data() {
    return {
      dialog: false,
      pickedFiles: [],
      selectedFiles: [],
      displayMedia: false,
    }
  },
  methods: {
    clickClose() {
      this.dialog = false;
    },

    openDialog() {
      this.dialog = true;
    },

    pickFile() {
      if(this.selectedFiles){
        this.pickedFiles = this.selectedFiles;
        this.$emit('update:modelValue', this.pickedFiles);
        this.clickClose();
      }
    },

    changeFileSelection(files: any){
      this.selectedFiles = files;
    }
  },
  watch: {
    dialog() {
      if (!this.dialog) {
        // hide form when dialog animation has finished
        setTimeout(() => this.displayMedia = false, 300);
      } else {
        this.displayMedia = true;
      }
    },
  }
});
</script>

<template>
  <v-row align="center" dense>
    <v-col cols="auto">
      <v-btn variant="tonal" class="me-2" @click="openDialog">
        Pick file
        <template v-if="pickedFiles.length">
          (picked files: {{ pickedFiles }})
        </template>
      </v-btn>
      <v-btn variant="tonal">Upload</v-btn>
    </v-col>
  </v-row>

  <v-dialog class="dt-dialog" v-model="dialog" :eager="true" max-width="1200">
    <v-card height="100vh">
      <v-card-title>
        <span class="text-h5">{{ $translator.tl('media.pickFile') }}</span>
        <span class="close">
            <i class="mdi mdi-close" @click="clickClose"></i>
          </span>
      </v-card-title>
      <v-card-text>
        <Media v-if="displayMedia" @pick="pickFile" @fileSelection="changeFileSelection" pick="true" />
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="tonal" @click="clickClose" prepend-icon="mdi-close">
          {{ $translator.tl('general.close') }}
        </v-btn>
        <v-btn variant="tonal" @click="pickFile" :disabled="!selectedFiles.length" prepend-icon="mdi-cursor-pointer">
          {{ $translator.tl('media.pickFile') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style lang="scss" scoped>
@use '@/assets/css/dialog';
</style>